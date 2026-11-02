package app.lettorepdf;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.ValueAnimator;
import android.app.ActivityManager;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Paint;
import android.graphics.RectF;
import android.graphics.Typeface;
import android.os.SystemClock;
import android.util.AttributeSet;
import android.util.TypedValue;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.View;
import android.view.animation.DecelerateInterpolator;
import android.widget.OverScroller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Visualizzatore PDF a scroll continuo con pinch-zoom.
 *
 * Disegno: per ogni pagina visibile una bitmap "base" alla risoluzione dello schermo (zoom 1);
 * quando si è in zoom, sopra la base vengono disegnate tessere ad alta risoluzione.
 * Il rendering avviene in {@link PdfEngine}; qui si decide solo cosa serve e si tiene la cache.
 */
public class PdfView extends View {

    interface Listener {
        void onPageChanged(int page, int count);

        void onTap();

        void onScrollStarted();
    }

    private static final float MAX_ZOOM = 5f;
    private static final float DOUBLE_TAP_ZOOM = 2.5f;
    private static final int DESK_DAY = 0xFFDCDFE4;
    private static final int DESK_NIGHT = 0xFF0C0D0F;
    private static final int PAGE_NIGHT = 0xFF181A1E;

    /** Bianco -> grigio scuro, nero -> grigio chiaro: meno abbagliante di un'inversione secca. */
    private static final ColorMatrixColorFilter NIGHT_FILTER = new ColorMatrixColorFilter(new ColorMatrix(new float[]{
            -0.788f, 0, 0, 0, 225,
            0, -0.788f, 0, 0, 227,
            0, 0, -0.784f, 0, 230,
            0, 0, 0, 1, 0}));

    private static final Comparator<PdfEngine.Job> BY_PRIO = (a, b) -> Float.compare(a.prio, b.prio);

    private static final class Entry {
        final Bitmap bmp;
        final long bytes;
        long stamp;

        Entry(Bitmap bmp) {
            this.bmp = bmp;
            this.bytes = bmp.getAllocationByteCount();
        }
    }

    private final PageLayout layout = new PageLayout();
    private PdfEngine engine;
    private Listener listener;

    private final float density;
    private final float gap;
    private int viewW, viewH;
    private float zoom = 1f, offX, offY;
    private float insetTop, insetBottom;     // barre di sistema/app che coprono la vista
    private float padTop, padBottom;          // spazio usato dall'ultimo layout
    private boolean night;
    private int tileLevel;                    // 0 = nessuna tessera, altrimenti zoom = tileLevel / 4
    private int shownPage = -1;
    private int pendingPage = -1;
    private float pendingFrac;

    // Cache LRU delle bitmap, limitata in byte. Solo thread UI.
    private final LinkedHashMap<TileKey, Entry> cache = new LinkedHashMap<>(64, 0.75f, true);
    private final long cacheBudget;
    private long cacheBytes;
    private long frame;
    private int epoch;
    private ArrayList<PdfEngine.Job> wanted = new ArrayList<>();
    private ArrayList<PdfEngine.Job> submitted = new ArrayList<>();

    // Gesti
    private final OverScroller scroller;
    private final GestureDetector gestures;
    private final ScaleGestureDetector scaler;
    private ValueAnimator zoomAnim;
    private boolean zoomAnimating, scrolling, dragging;
    private float dragGrab;
    private long scaleEndedAt, lastScrollMs;
    private float indicatorAlpha;

    // Disegno
    private final Paint pagePaint = new Paint();
    private final Paint bmpPaint = new Paint(Paint.FILTER_BITMAP_FLAG);
    private final Paint thumbPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint pillPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final Paint textPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    private final RectF rect = new RectF();
    private final RectF thumbRect = new RectF();
    private final RectF pillRect = new RectF();

    public PdfView(Context context) {
        this(context, null);
    }

    public PdfView(Context context, AttributeSet attrs) {
        super(context, attrs);
        density = context.getResources().getDisplayMetrics().density;
        gap = 8 * density;

        scroller = new OverScroller(context);
        gestures = new GestureDetector(context, new GestureListener());
        gestures.setIsLongpressEnabled(false);
        scaler = new ScaleGestureDetector(context, new ScaleListener());
        scaler.setQuickScaleEnabled(false);

        ActivityManager am = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        long classMb = am != null ? am.getMemoryClass() : 128;
        cacheBudget = Math.max(64L, Math.min(160L, (long) (classMb * 0.4))) * 1024L * 1024L;

        pagePaint.setColor(Color.WHITE);
        textPaint.setColor(Color.WHITE);
        textPaint.setTextAlign(Paint.Align.CENTER);
        textPaint.setTextSize(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP, 14,
                context.getResources().getDisplayMetrics()));
        textPaint.setTypeface(Typeface.create("sans-serif-medium", Typeface.NORMAL));
        setWillNotDraw(false);
    }

    // ---------------------------------------------------------------- API

    void setListener(Listener l) {
        listener = l;
    }

    void setNight(boolean on) {
        night = on;
        bmpPaint.setColorFilter(on ? NIGHT_FILTER : null);
        pagePaint.setColor(on ? PAGE_NIGHT : Color.WHITE);
        invalidate();
    }

    /** Spazio coperto dalla barra superiore e dalla barra di navigazione (px). */
    void setContentInsets(int top, int bottom) {
        if (top == insetTop && bottom == insetBottom) return;
        insetTop = top;
        insetBottom = bottom;
        relayout(false);
    }

    void open(PdfEngine engine, int pageCount, float firstW, float firstH) {
        this.engine = engine;
        layout.init(pageCount, firstW, firstH);
        zoom = 1f;
        offX = 0f;
        offY = 0f;
        tileLevel = 0;
        shownPage = -1;
        clearCache();
        relayout(false);
    }

    void onPageSizes(int start, float[] w, float[] h) {
        boolean changed = false;
        for (int i = 0; i < w.length; i++) {
            if (layout.setSize(start + i, w[i], h[i])) {
                removePage(start + i);
                changed = true;
            }
        }
        if (changed) relayout(false);
    }

    void onTile(TileKey key, int tileEpoch, Bitmap bmp) {
        if (tileEpoch != epoch) return;
        submitted.clear();
        Entry old = cache.remove(key);
        if (old != null) cacheBytes -= old.bytes;
        Entry e = new Entry(bmp);
        cache.put(key, e);
        cacheBytes += e.bytes;
        trim(key);
        invalidate();
    }

    int pageCount() {
        return layout.count();
    }

    /** Allinea la pagina in alto (usato dopo "Vai a pagina", con le barre nascoste). */
    void goToPage(int page) {
        if (layout.count() == 0 || layout.width() <= 0) return;
        page = Math.max(0, Math.min(layout.count() - 1, page));
        offY = layout.top(page) * zoom - gap;
        clampOffsets();
        scrolled();
        invalidate();
    }

    /** Ripristina una posizione salvata: pagina + frazione dell'altezza della pagina. */
    void scrollToPosition(int page, float frac) {
        if (layout.count() == 0) return;
        page = Math.max(0, Math.min(layout.count() - 1, page));
        if (layout.width() <= 0) {
            pendingPage = page;
            pendingFrac = frac;
            return;
        }
        offY = (layout.top(page) + frac * layout.height(page)) * zoom - padTop;
        clampOffsets();
        scrolled();
        invalidate();
    }

    int positionPage() {
        if (layout.count() == 0) return 0;
        return layout.pageAt((offY + padTop) / zoom);
    }

    float positionFrac() {
        if (layout.count() == 0) return 0f;
        float y = (offY + padTop) / zoom;
        int p = layout.pageAt(y);
        return Math.max(0f, Math.min(1f, (y - layout.top(p)) / layout.height(p)));
    }

    /** Pagina mostrata al centro dello schermo. */
    int currentPage() {
        int n = layout.count();
        if (n == 0) return 0;
        float max = maxOffY();
        if (max > 1f) {
            if (offY <= 1f) return 0;
            if (offY >= max - 1f) return n - 1;
        }
        return layout.pageAt((offY + viewH / 2f) / zoom);
    }

    void trimMemory() {
        clearCache();
        invalidate();
    }

    void release() {
        if (zoomAnim != null) zoomAnim.cancel();
        engine = null;
        clearCache();
    }

    // ---------------------------------------------------------------- layout e scroll

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        boolean widthChanged = w != viewW;
        viewW = w;
        viewH = h;
        if (widthChanged) clearCache();
        relayout(widthChanged);
    }

    private void relayout(boolean resetZoom) {
        if (viewW <= 0 || layout.count() == 0) {
            if (resetZoom) {
                zoom = 1f;
                offX = 0f;
            }
            return;
        }
        final boolean had = layout.width() > 0;
        int p = 0;
        float frac = 0f;
        if (had) {
            // Si mantiene ferma la riga di lettura (subito sotto la barra) attraverso il nuovo layout.
            float y = (offY + padTop) / zoom;
            p = layout.pageAt(y);
            frac = (y - layout.top(p)) / layout.height(p);
        }
        if (resetZoom) {
            zoom = 1f;
            offX = 0f;
        }
        padTop = insetTop + gap;
        padBottom = insetBottom + gap;
        layout.layout(viewW, gap, padTop, padBottom);
        if (had) offY = (layout.top(p) + frac * layout.height(p)) * zoom - padTop;
        clampOffsets();
        if (pendingPage >= 0) {
            int pp = pendingPage;
            pendingPage = -1;
            scrollToPosition(pp, pendingFrac);
        }
        notifyPage();
        invalidate();
    }

    private float maxOffX() {
        return Math.max(0f, viewW * zoom - viewW);
    }

    private float maxOffY() {
        if (layout.count() == 0) return 0f;
        return Math.max(0f, layout.total() * zoom - viewH);
    }

    private void clampOffsets() {
        offX = Math.max(0f, Math.min(maxOffX(), offX));
        offY = Math.max(0f, Math.min(maxOffY(), offY));
    }

    private void scrolled() {
        lastScrollMs = SystemClock.uptimeMillis();
        notifyPage();
    }

    private void notifyPage() {
        if (layout.count() == 0) return;
        int p = currentPage();
        if (p != shownPage) {
            shownPage = p;
            if (listener != null) listener.onPageChanged(p, layout.count());
        }
    }

    private void zoomAround(float newZoom, float fx, float fy) {
        newZoom = Math.max(1f, Math.min(MAX_ZOOM, newZoom));
        if (newZoom == zoom) return;
        float cx = (offX + fx) / zoom;
        float cy = (offY + fy) / zoom;
        zoom = newZoom;
        offX = cx * zoom - fx;
        offY = cy * zoom - fy;
        clampOffsets();
        scrolled();
        invalidate();
    }

    private void animateZoom(float to, final float fx, final float fy) {
        if (zoomAnim != null) zoomAnim.cancel();
        scroller.forceFinished(true);
        zoomAnimating = true;
        zoomAnim = ValueAnimator.ofFloat(zoom, to);
        zoomAnim.setDuration(220);
        zoomAnim.setInterpolator(new DecelerateInterpolator());
        zoomAnim.addUpdateListener(a -> zoomAround((Float) a.getAnimatedValue(), fx, fy));
        zoomAnim.addListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                zoomAnimating = false;
                invalidate();
            }
        });
        zoomAnim.start();
    }

    // ---------------------------------------------------------------- cache

    private Bitmap cached(TileKey key) {
        Entry e = cache.get(key);
        if (e == null) return null;
        e.stamp = frame;
        return e.bmp;
    }

    /** Toglie le bitmap meno usate; quelle disegnate nell'ultimo frame non si toccano (niente rimbalzi). */
    private void trim(TileKey keep) {
        if (cacheBytes <= cacheBudget) return;
        Iterator<Map.Entry<TileKey, Entry>> it = cache.entrySet().iterator();
        while (cacheBytes > cacheBudget && it.hasNext()) {
            Map.Entry<TileKey, Entry> e = it.next();
            if (e.getValue().stamp == frame || e.getKey().equals(keep)) continue;
            cacheBytes -= e.getValue().bytes;
            it.remove();
        }
    }

    private void clearCache() {
        cache.clear();
        cacheBytes = 0;
        epoch++;
        submitted.clear();
        wanted.clear();
        if (engine != null) engine.request(wanted);
    }

    private void removePage(int page) {
        Iterator<Map.Entry<TileKey, Entry>> it = cache.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<TileKey, Entry> e = it.next();
            if (e.getKey().page == page) {
                cacheBytes -= e.getValue().bytes;
                it.remove();
            }
        }
        epoch++;
        submitted.clear();
    }

    private void addJob(TileKey key, float pageWidthPx, float prio) {
        wanted.add(new PdfEngine.Job(key, pageWidthPx, prio, epoch));
    }

    private void addBaseIfMissing(int page, float prio) {
        TileKey k = new TileKey(page, 0, 0, 0);
        if (!cache.containsKey(k)) addJob(k, viewW, prio);
    }

    private void submit() {
        Collections.sort(wanted, BY_PRIO);
        if (wanted.equals(submitted)) return;
        engine.request(wanted);
        ArrayList<PdfEngine.Job> t = submitted;
        submitted = wanted;
        wanted = t;
    }

    // ---------------------------------------------------------------- disegno

    @Override
    protected void onDraw(Canvas c) {
        frame++;
        c.drawColor(night ? DESK_NIGHT : DESK_DAY);
        final int n = layout.count();
        if (engine == null || n == 0 || layout.width() <= 0) return;

        final float z = zoom;
        if (z <= 1.001f) {
            tileLevel = 0;
        } else if (!scaler.isInProgress() && !zoomAnimating) {
            tileLevel = Math.max(5, (int) Math.ceil(z * 4f - 0.02f));
        }

        final float yTop = offY / z;
        final float yBottom = (offY + viewH) / z;
        final float left = -offX;
        final float pageW = viewW * z;
        final float cy = viewH / 2f;
        final int first = layout.pageAt(yTop);
        int last = first;
        wanted.clear();

        for (int i = first; i < n; i++) {
            float top = layout.top(i);
            if (top > yBottom) break;
            last = i;
            float pt = top * z - offY;
            float ph = layout.height(i) * z;
            rect.set(left, pt, left + pageW, pt + ph);
            c.drawRect(rect, pagePaint);

            TileKey baseKey = new TileKey(i, 0, 0, 0);
            Bitmap base = cached(baseKey);
            if (base != null) {
                c.drawBitmap(base, null, rect, bmpPaint);
            } else {
                addJob(baseKey, viewW, Math.abs(pt + ph / 2f - cy));
            }
            if (tileLevel > 0 && z > 1.001f) drawTiles(c, i, left, pt, z, cy);
        }

        // Pagine vicine: pronte prima che servano.
        if (first > 0) addBaseIfMissing(first - 1, 2e7f);
        if (last + 1 < n) addBaseIfMissing(last + 1, 2e7f);
        if (last + 2 < n) addBaseIfMissing(last + 2, 2e7f + 1f);
        submit();

        drawIndicators(c);
    }

    private void drawTiles(Canvas c, int page, float left, float pt, float z, float cy) {
        final int k = tileLevel;
        final float zk = k / 4f;
        final float ratio = z / zk;                         // dimensione a schermo di 1 px di tessera
        final float tilePx = PdfEngine.TILE * ratio;
        final float pageWpx = viewW * zk;
        final float pageHpx = layout.height(page) * zk;
        final int cols = Math.max(1, (int) Math.ceil(pageWpx / PdfEngine.TILE));
        final int rows = Math.max(1, (int) Math.ceil(pageHpx / PdfEngine.TILE));
        final float margin = tilePx * 0.5f;                  // tessere preparate appena fuori schermo

        final int tx0 = clamp((int) Math.floor((-margin - left) / tilePx), 0, cols - 1);
        final int tx1 = clamp((int) Math.floor((viewW + margin - left) / tilePx), 0, cols - 1);
        final int ty0 = clamp((int) Math.floor((-margin - pt) / tilePx), 0, rows - 1);
        final int ty1 = clamp((int) Math.floor((viewH + margin - pt) / tilePx), 0, rows - 1);
        final float cx = viewW / 2f;

        for (int ty = ty0; ty <= ty1; ty++) {
            for (int tx = tx0; tx <= tx1; tx++) {
                TileKey key = new TileKey(page, k, tx, ty);
                Bitmap b = cached(key);
                float dl = left + tx * tilePx;
                float dt = pt + ty * tilePx;
                float dr = dl + (b != null ? b.getWidth() : PdfEngine.TILE) * ratio;
                float db = dt + (b != null ? b.getHeight() : PdfEngine.TILE) * ratio;
                boolean visible = dr > 0 && dl < viewW && db > 0 && dt < viewH;
                if (b != null) {
                    if (visible) {
                        rect.set(dl, dt, dr, db);
                        c.drawBitmap(b, null, rect, bmpPaint);
                    }
                } else {
                    float dist = Math.abs((dl + dr) / 2f - cx) + Math.abs((dt + db) / 2f - cy);
                    addJob(key, pageWpx, (visible ? 1e7f : 1.5e7f) + dist);
                }
            }
        }
    }

    private void drawIndicators(Canvas c) {
        long dt = SystemClock.uptimeMillis() - lastScrollMs;
        float a = dragging || dt < 900 ? 1f : dt < 1300 ? 1f - (dt - 900) / 400f : 0f;
        indicatorAlpha = a;
        if (a <= 0f) return;
        if (!dragging) postInvalidateOnAnimation();

        final float maxY = maxOffY();
        if (maxY > 0f) {
            float th = 44 * density;
            float tw = (dragging ? 8 : 4) * density;
            float trackTop = insetTop;
            float range = Math.max(1f, viewH - insetBottom - trackTop - th);
            float top = trackTop + (offY / maxY) * range;
            float right = viewW - 3 * density;
            thumbRect.set(right - tw, top, right, top + th);
            thumbPaint.setColor(night ? 0xFFB6BEC9 : 0xFF4B5563);
            thumbPaint.setAlpha((int) (a * 190));
            c.drawRoundRect(thumbRect, tw / 2f, tw / 2f, thumbPaint);
        }

        final int n = layout.count();
        if (n > 1) {
            String s = (shownPage + 1) + " / " + n;
            float ph = 32 * density;
            float pw = textPaint.measureText(s) + 28 * density;
            float cx = viewW / 2f;
            float bottom = viewH - insetBottom - 16 * density;
            pillRect.set(cx - pw / 2f, bottom - ph, cx + pw / 2f, bottom);
            pillPaint.setColor(0xFF1E2126);
            pillPaint.setAlpha((int) (a * 215));
            c.drawRoundRect(pillRect, ph / 2f, ph / 2f, pillPaint);
            textPaint.setAlpha((int) (a * 255));
            float baseline = pillRect.centerY() - (textPaint.ascent() + textPaint.descent()) / 2f;
            c.drawText(s, cx, baseline, textPaint);
        }
    }

    private static int clamp(int v, int lo, int hi) {
        return Math.max(lo, Math.min(hi, v));
    }

    // ---------------------------------------------------------------- tocco

    @Override
    public boolean onTouchEvent(MotionEvent e) {
        if (engine == null || layout.count() == 0) return true;
        if (handleThumb(e)) return true;
        scaler.onTouchEvent(e);
        gestures.onTouchEvent(e);
        int action = e.getActionMasked();
        if (action == MotionEvent.ACTION_UP || action == MotionEvent.ACTION_CANCEL) scrolling = false;
        return true;
    }

    @Override
    public boolean onGenericMotionEvent(MotionEvent e) {
        if (e.getAction() == MotionEvent.ACTION_SCROLL && layout.count() > 0) {
            // Rotella del mouse / trackpad.
            offY -= e.getAxisValue(MotionEvent.AXIS_VSCROLL) * 64 * density;
            offX -= e.getAxisValue(MotionEvent.AXIS_HSCROLL) * 64 * density;
            clampOffsets();
            scrolled();
            invalidate();
            return true;
        }
        return super.onGenericMotionEvent(e);
    }

    private boolean handleThumb(MotionEvent e) {
        switch (e.getActionMasked()) {
            case MotionEvent.ACTION_DOWN:
                if (indicatorAlpha > 0.2f && maxOffY() > 0f
                        && e.getX() >= viewW - 36 * density
                        && e.getY() >= thumbRect.top - 12 * density
                        && e.getY() <= thumbRect.bottom + 12 * density) {
                    dragging = true;
                    scroller.forceFinished(true);
                    dragGrab = Math.max(0f, Math.min(thumbRect.height(), e.getY() - thumbRect.top));
                    dragTo(e.getY());
                    return true;
                }
                return false;
            case MotionEvent.ACTION_MOVE:
                if (dragging) {
                    dragTo(e.getY());
                    return true;
                }
                return false;
            case MotionEvent.ACTION_UP:
            case MotionEvent.ACTION_CANCEL:
                if (dragging) {
                    dragging = false;
                    lastScrollMs = SystemClock.uptimeMillis();
                    invalidate();
                    return true;
                }
                return false;
            default:
                return dragging;
        }
    }

    private void dragTo(float y) {
        float th = 44 * density;
        float range = Math.max(1f, viewH - insetBottom - insetTop - th);
        float f = Math.max(0f, Math.min(1f, (y - dragGrab - insetTop) / range));
        offY = f * maxOffY();
        scrolled();
        invalidate();
    }

    @Override
    public void computeScroll() {
        if (scroller.computeScrollOffset()) {
            offX = scroller.getCurrX();
            offY = scroller.getCurrY();
            clampOffsets();
            scrolled();
            postInvalidateOnAnimation();
        }
    }

    private final class GestureListener extends GestureDetector.SimpleOnGestureListener {
        @Override
        public boolean onDown(MotionEvent e) {
            scroller.forceFinished(true);
            return true;
        }

        @Override
        public boolean onScroll(MotionEvent e1, MotionEvent e2, float dx, float dy) {
            if (!scrolling) {
                scrolling = true;
                if (listener != null) listener.onScrollStarted();
            }
            offX += dx;
            offY += dy;
            clampOffsets();
            scrolled();
            invalidate();
            return true;
        }

        @Override
        public boolean onFling(MotionEvent e1, MotionEvent e2, float vx, float vy) {
            // Dopo un pinch il dito rimasto genera velocità spurie.
            if (SystemClock.uptimeMillis() - scaleEndedAt < 250) return false;
            scroller.fling(Math.round(offX), Math.round(offY), Math.round(-vx), Math.round(-vy),
                    0, Math.round(maxOffX()), 0, Math.round(maxOffY()));
            postInvalidateOnAnimation();
            return true;
        }

        @Override
        public boolean onSingleTapConfirmed(MotionEvent e) {
            if (listener != null) listener.onTap();
            return true;
        }

        @Override
        public boolean onDoubleTap(MotionEvent e) {
            animateZoom(zoom > 1.5f ? 1f : DOUBLE_TAP_ZOOM, e.getX(), e.getY());
            return true;
        }
    }

    private final class ScaleListener extends ScaleGestureDetector.SimpleOnScaleGestureListener {
        @Override
        public boolean onScaleBegin(ScaleGestureDetector d) {
            scroller.forceFinished(true);
            if (zoomAnim != null) zoomAnim.cancel();
            return true;
        }

        @Override
        public boolean onScale(ScaleGestureDetector d) {
            zoomAround(zoom * d.getScaleFactor(), d.getFocusX(), d.getFocusY());
            return true;
        }

        @Override
        public void onScaleEnd(ScaleGestureDetector d) {
            scaleEndedAt = SystemClock.uptimeMillis();
            invalidate();
        }
    }
}
