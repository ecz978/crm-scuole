package app.lettorepdf;

import android.content.ContentResolver;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.pdf.PdfRenderer;
import android.net.Uri;
import android.os.Handler;
import android.os.Looper;
import android.os.ParcelFileDescriptor;
import android.os.Process;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayDeque;
import java.util.List;

/**
 * Apre il PDF e produce le bitmap su un thread dedicato.
 * PdfRenderer non è thread-safe e tiene aperta una sola pagina alla volta, quindi tutto passa da qui.
 * La coda viene sostituita a ogni richiesta: il lavoro non più visibile viene scartato.
 */
final class PdfEngine {

    static final int FAIL_IO = 1;
    static final int FAIL_PASSWORD = 2;

    /** Lato (px) delle tessere usate quando si è in zoom. */
    static final int TILE = 512;

    private static final int MAX_BASE_HEIGHT = 4096;
    private static final int SCAN_CHUNK = 24;
    private static final int THUMB_WIDTH = 192;

    /** Callback sempre sul thread principale. */
    interface Listener {
        void onOpened(int pageCount, float firstW, float firstH);

        void onFailed(int reason);

        void onPageSizes(int start, float[] w, float[] h);

        void onTile(TileKey key, int epoch, Bitmap bitmap);
    }

    /** Richiesta di rendering. */
    static final class Job {
        final TileKey key;
        /** Larghezza in pixel dell'intera pagina al livello di zoom richiesto. */
        final float pageWidthPx;
        final float prio;
        /** Generazione della vista che ha chiesto il lavoro: i risultati di generazioni vecchie vengono ignorati. */
        final int epoch;

        Job(TileKey key, float pageWidthPx, float prio, int epoch) {
            this.key = key;
            this.pageWidthPx = pageWidthPx;
            this.prio = prio;
            this.epoch = epoch;
        }

        @Override
        public boolean equals(Object o) {
            return o instanceof Job && ((Job) o).key.equals(key);
        }

        @Override
        public int hashCode() {
            return key.hashCode();
        }
    }

    private final Context context;
    private final Uri uri;
    private final File thumbFile;
    private final Listener listener;
    private final Handler main = new Handler(Looper.getMainLooper());

    private final Object lock = new Object();
    private final ArrayDeque<Job> queue = new ArrayDeque<>();
    private TileKey inFlight;
    private volatile boolean closed;

    // Usati solo dal thread di lavoro.
    private PdfRenderer renderer;
    private PdfRenderer.Page current;
    private int currentIndex = -1;
    private File tempCopy;
    private int pageCount;
    private int scanNext = 1;
    private boolean thumbPending;

    PdfEngine(Context context, Uri uri, File thumbFile, Listener listener) {
        this.context = context.getApplicationContext();
        this.uri = uri;
        this.thumbFile = thumbFile;
        this.thumbPending = thumbFile != null;
        this.listener = listener;
        Thread t = new Thread(this::run, "pdf-engine");
        t.setDaemon(true);
        t.start();
    }

    /** Sostituisce la coda di rendering (in ordine di priorità). */
    void request(List<Job> jobs) {
        synchronized (lock) {
            queue.clear();
            for (Job j : jobs) {
                if (!j.key.equals(inFlight)) queue.add(j);
            }
            lock.notifyAll();
        }
    }

    void close() {
        synchronized (lock) {
            closed = true;
            queue.clear();
            lock.notifyAll();
        }
    }

    // ---------------------------------------------------------------- thread di lavoro

    private void run() {
        Process.setThreadPriority(Process.THREAD_PRIORITY_FOREGROUND);
        try {
            if (!open()) return;
            loop();
        } finally {
            cleanup();
        }
    }

    private boolean open() {
        try {
            renderer = openRenderer();
            pageCount = renderer.getPageCount();
            if (pageCount <= 0) throw new IOException("empty document");
            PdfRenderer.Page p = renderer.openPage(0);
            final float w = p.getWidth(), h = p.getHeight();
            p.close();
            main.post(() -> {
                if (!closed) listener.onOpened(pageCount, w, h);
            });
            return true;
        } catch (SecurityException e) {
            fail(FAIL_PASSWORD);
        } catch (Throwable e) {
            fail(FAIL_IO);
        }
        return false;
    }

    private void fail(final int reason) {
        main.post(() -> {
            if (!closed) listener.onFailed(reason);
        });
    }

    private PdfRenderer openRenderer() throws IOException {
        ContentResolver cr = context.getContentResolver();
        ParcelFileDescriptor pfd;
        try {
            pfd = cr.openFileDescriptor(uri, "r");
        } catch (SecurityException e) {
            throw new IOException("no access", e);
        }
        if (pfd == null) throw new FileNotFoundException(uri.toString());
        try {
            return new PdfRenderer(pfd);
        } catch (SecurityException e) {
            closeQuietly(pfd);
            throw e;
        } catch (IllegalArgumentException | IOException e) {
            // Descrittore non "seekable" (alcuni provider): si riprova con una copia in cache.
            closeQuietly(pfd);
        }
        tempCopy = new File(context.getCacheDir(), "copy-" + System.nanoTime() + ".pdf");
        try (InputStream in = cr.openInputStream(uri); OutputStream out = new FileOutputStream(tempCopy)) {
            if (in == null) throw new FileNotFoundException(uri.toString());
            byte[] buf = new byte[64 * 1024];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
        }
        return new PdfRenderer(ParcelFileDescriptor.open(tempCopy, ParcelFileDescriptor.MODE_READ_ONLY));
    }

    private static void closeQuietly(ParcelFileDescriptor pfd) {
        try {
            pfd.close();
        } catch (IOException ignored) {
        }
    }

    private void loop() {
        while (true) {
            Job job = null;
            boolean doThumb = false;
            synchronized (lock) {
                while (!closed) {
                    job = queue.pollFirst();
                    if (job != null) {
                        inFlight = job.key;
                        break;
                    }
                    if (thumbPending) {
                        thumbPending = false;
                        doThumb = true;
                        break;
                    }
                    if (scanNext < pageCount) break;
                    try {
                        lock.wait();
                    } catch (InterruptedException e) {
                        closed = true;
                    }
                }
                if (closed) return;
            }
            if (job != null) {
                render(job);
                synchronized (lock) {
                    inFlight = null;
                }
            } else if (doThumb) {
                thumbnail();
            } else {
                scanSizes();
            }
        }
    }

    private PdfRenderer.Page page(int index) {
        if (currentIndex != index) {
            closeCurrent();
            current = renderer.openPage(index);
            currentIndex = index;
        }
        return current;
    }

    private void closeCurrent() {
        if (current != null) {
            try {
                current.close();
            } catch (RuntimeException ignored) {
            }
        }
        current = null;
        currentIndex = -1;
    }

    private void render(Job job) {
        final TileKey key = job.key;
        final int epoch = job.epoch;
        Bitmap bmp = null;
        try {
            PdfRenderer.Page page = page(key.page);
            float pw = page.getWidth(), ph = page.getHeight();
            float scale;
            int x0 = 0, y0 = 0, w, h;
            if (key.level == 0) {
                scale = job.pageWidthPx / pw;
                if (ph * scale > MAX_BASE_HEIGHT) scale = MAX_BASE_HEIGHT / ph;
                w = Math.max(1, (int) Math.ceil(pw * scale));
                h = Math.max(1, (int) Math.ceil(ph * scale));
            } else {
                scale = job.pageWidthPx / pw;
                x0 = key.x * TILE;
                y0 = key.y * TILE;
                w = Math.max(1, Math.min(TILE, (int) Math.ceil(pw * scale) - x0));
                h = Math.max(1, Math.min(TILE, (int) Math.ceil(ph * scale) - y0));
            }
            bmp = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888);
            bmp.eraseColor(Color.WHITE);
            Matrix m = new Matrix();
            m.setScale(scale, scale);
            m.postTranslate(-x0, -y0);
            page.render(bmp, null, m, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);
        } catch (Throwable t) {
            // Pagina rovinata o memoria finita: si consegna comunque una bitmap bianca (evita richieste infinite).
            closeCurrent();
            if (bmp == null) {
                try {
                    bmp = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888);
                    bmp.eraseColor(Color.WHITE);
                } catch (Throwable ignored) {
                    return;
                }
            }
        }
        final Bitmap result = bmp;
        main.post(() -> {
            if (closed) {
                result.recycle();
            } else {
                listener.onTile(key, epoch, result);
            }
        });
    }

    /** Legge le dimensioni di tutte le pagine, a blocchi, solo quando non c'è altro da fare. */
    private void scanSizes() {
        int start = scanNext;
        int end = Math.min(pageCount, start + SCAN_CHUNK);
        final float[] w = new float[end - start];
        final float[] h = new float[end - start];
        closeCurrent();
        for (int i = start; i < end; i++) {
            try {
                PdfRenderer.Page p = renderer.openPage(i);
                w[i - start] = p.getWidth();
                h[i - start] = p.getHeight();
                p.close();
            } catch (RuntimeException e) {
                w[i - start] = 0;
                h[i - start] = 0;
            }
        }
        scanNext = end;
        final int s = start;
        main.post(() -> {
            if (!closed) listener.onPageSizes(s, w, h);
        });
    }

    private void thumbnail() {
        try {
            PdfRenderer.Page p = page(0);
            float scale = THUMB_WIDTH / p.getWidth();
            int w = THUMB_WIDTH;
            int h = Math.max(1, Math.min(THUMB_WIDTH * 2, Math.round(p.getHeight() * scale)));
            Bitmap b = Bitmap.createBitmap(w, h, Bitmap.Config.ARGB_8888);
            b.eraseColor(Color.WHITE);
            Matrix m = new Matrix();
            m.setScale(scale, scale);
            p.render(b, null, m, PdfRenderer.Page.RENDER_MODE_FOR_DISPLAY);
            File dir = thumbFile.getParentFile();
            if (dir != null) dir.mkdirs();
            try (FileOutputStream out = new FileOutputStream(thumbFile)) {
                b.compress(Bitmap.CompressFormat.JPEG, 82, out);
            }
            b.recycle();
        } catch (Throwable ignored) {
            closeCurrent();
        }
    }

    private void cleanup() {
        closeCurrent();
        if (renderer != null) {
            try {
                renderer.close();
            } catch (RuntimeException ignored) {
            }
        }
        if (tempCopy != null) {
            //noinspection ResultOfMethodCallIgnored
            tempCopy.delete();
        }
    }
}
