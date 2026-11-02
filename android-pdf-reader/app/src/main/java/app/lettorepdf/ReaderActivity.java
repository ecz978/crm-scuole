package app.lettorepdf;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ClipData;
import android.content.ComponentCallbacks2;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.ColorStateList;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.text.InputType;
import android.view.KeyEvent;
import android.view.View;
import android.view.WindowManager;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import java.util.List;
import java.util.Locale;

/** Lettore: pagine a tutto schermo, barra che compare con un tocco. */
public class ReaderActivity extends Activity implements PdfEngine.Listener, PdfView.Listener {

    private static final String PREF_NIGHT = "night";

    private PdfView pdf;
    private View root, bar, spinner;
    private TextView title, subtitle, message;
    private ImageButton btnBack, btnGoto, btnNight, btnShare;
    private View rowMain, rowSearch;
    private EditText searchInput;
    private TextView searchCount;
    private ImageButton btnSearch, btnSearchClose, btnPrev, btnNext;

    private final SearchResults results = new SearchResults();
    private boolean searchMode;
    private boolean queried;
    private int searchId;

    private SharedPreferences prefs;
    private PdfEngine engine;
    private Uri uri;
    private String name;
    private int pageCount;
    private boolean opened;
    private boolean night;
    private boolean barsVisible = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        uri = getIntent().getData();
        if (uri == null) {
            finish();
            return;
        }
        prefs = getSharedPreferences("prefs", MODE_PRIVATE);
        night = prefs.getBoolean(PREF_NIGHT, Ui.isSystemNight(this));

        Ui.edgeToEdge(this);
        setContentView(R.layout.activity_reader);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        root = findViewById(R.id.root);
        pdf = findViewById(R.id.pdf);
        bar = findViewById(R.id.bar);
        spinner = findViewById(R.id.spinner);
        title = findViewById(R.id.title);
        subtitle = findViewById(R.id.subtitle);
        message = findViewById(R.id.message);
        btnBack = findViewById(R.id.btn_back);
        btnGoto = findViewById(R.id.btn_goto);
        btnNight = findViewById(R.id.btn_night);
        btnShare = findViewById(R.id.btn_share);
        rowMain = findViewById(R.id.row_main);
        rowSearch = findViewById(R.id.row_search);
        searchInput = findViewById(R.id.search_input);
        searchCount = findViewById(R.id.search_count);
        btnSearch = findViewById(R.id.btn_search);
        btnSearchClose = findViewById(R.id.btn_search_close);
        btnPrev = findViewById(R.id.btn_prev);
        btnNext = findViewById(R.id.btn_next);

        name = displayName(uri);
        title.setText(name);
        pdf.setListener(this);

        btnBack.setOnClickListener(v -> finish());
        btnGoto.setOnClickListener(v -> askPage());
        btnNight.setOnClickListener(v -> {
            night = !night;
            prefs.edit().putBoolean(PREF_NIGHT, night).apply();
            applyChrome();
        });
        btnShare.setOnClickListener(v -> share());
        btnSearch.setOnClickListener(v -> openSearch());
        btnSearchClose.setOnClickListener(v -> closeSearch());
        btnPrev.setOnClickListener(v -> stepHit(-1));
        btnNext.setOnClickListener(v -> stepHit(1));
        searchInput.setOnEditorActionListener((v, actionId, ev) -> {
            boolean enter = ev != null && ev.getKeyCode() == KeyEvent.KEYCODE_ENTER
                    && ev.getAction() == KeyEvent.ACTION_DOWN;
            if (actionId == EditorInfo.IME_ACTION_SEARCH || enter) {
                startSearch();
                return true;
            }
            return false;
        });

        root.setOnApplyWindowInsetsListener((v, in) -> {
            // A barre di sistema nascoste gli inset valgono 0: li ignoriamo per non far saltare il layout.
            if (barsVisible) {
                int[] i = Ui.insets(in);
                bar.setPadding(i[0], i[1], i[2], 0);
                pdf.setContentInsets(Ui.dp(this, 56) + i[1], i[3]);
            }
            return in;
        });

        applyChrome();
        root.requestApplyInsets();

        // Se qualcosa va storto prima dell'apertura (es. permesso scaduto) lo scopriamo in onFailed.
        engine = new PdfEngine(this, uri, Recents.thumb(this, uri.toString()), this);
    }

    // ---------------------------------------------------------------- motore

    @Override
    public void onOpened(int count, float firstW, float firstH) {
        opened = true;
        pageCount = count;
        spinner.setVisibility(View.GONE);
        pdf.open(engine, count, firstW, firstH);

        Recents.Item saved = Recents.find(this, uri.toString());
        int page = saved != null ? Math.min(saved.page, count - 1) : 0;
        float frac = saved != null ? saved.frac : 0f;
        pdf.scrollToPosition(page, frac);
        Recents.save(this, uri.toString(), name, page, frac, count);
    }

    @Override
    public void onFailed(int reason) {
        spinner.setVisibility(View.GONE);
        message.setText(reason == PdfEngine.FAIL_PASSWORD ? R.string.err_password : R.string.err_open);
        message.setVisibility(View.VISIBLE);
        // File sparito o permesso scaduto: inutile tenerlo tra i recenti.
        if (reason == PdfEngine.FAIL_IO) Recents.remove(this, uri.toString());
    }

    @Override
    public void onPageSizes(int start, float[] w, float[] h) {
        pdf.onPageSizes(start, w, h);
    }

    @Override
    public void onTile(TileKey key, int epoch, Bitmap bitmap) {
        pdf.onTile(key, epoch, bitmap);
    }

    @Override
    public void onSearchHits(int id, int page, float pageW, float pageH, List<SearchHit> hits) {
        if (id != searchId || !searchMode) return;
        pdf.onPageSizes(page, new float[]{pageW}, new float[]{pageH});   // le coordinate sono in punti della pagina reale
        final int before = results.size();
        final boolean capped = results.add(hits);
        pdf.addHits(hits.subList(0, Math.min(hits.size(), results.size() - before)));
        if (before == 0 && results.current() != null) pdf.showHit(results.current());
        if (capped) {
            engine.cancelSearch();
            finishSearch();
        } else {
            updateCount();
        }
    }

    @Override
    public void onSearchDone(int id) {
        if (id != searchId || !searchMode) return;
        finishSearch();
    }

    // ---------------------------------------------------------------- vista

    @Override
    public void onPageChanged(int page, int count) {
        subtitle.setText(getString(R.string.page_of, page + 1, count));
    }

    @Override
    public void onTap() {
        setBars(!barsVisible);
    }

    @Override
    public void onScrollStarted() {
        // Durante la ricerca la barra resta, serve per spostarsi tra i risultati.
        if (barsVisible && !searchMode) setBars(false);
    }

    private void setBars(boolean show) {
        barsVisible = show;
        Ui.systemBars(this, !night, !show);
        bar.animate().cancel();
        if (show) {
            bar.setVisibility(View.VISIBLE);
            bar.animate().alpha(1f).translationY(0f).setDuration(160).start();
        } else {
            bar.animate().alpha(0f).translationY(-bar.getHeight()).setDuration(160)
                    .withEndAction(() -> {
                        if (!barsVisible) bar.setVisibility(View.GONE);
                    }).start();
        }
    }

    /** Colori di barra e icone in base alla modalità notte (indipendente dal tema di sistema). */
    private void applyChrome() {
        pdf.setNight(night);
        int fg = night ? 0xFFECEEF2 : 0xFF14171A;
        int fg2 = night ? 0xFF9AA3AF : 0xFF5F6672;
        root.setBackgroundColor(night ? 0xFF0C0D0F : 0xFFDCDFE4);
        bar.setBackgroundColor(night ? 0xF21A1D23 : 0xF2FFFFFF);
        title.setTextColor(fg);
        subtitle.setTextColor(fg2);
        message.setTextColor(fg2);
        for (ImageButton b : new ImageButton[]{btnBack, btnGoto, btnNight, btnShare, btnSearch,
                btnSearchClose, btnPrev, btnNext}) {
            b.setColorFilter(fg);
        }
        searchInput.setTextColor(fg);
        searchInput.setHintTextColor(fg2);
        searchCount.setTextColor(fg2);
        btnNight.setImageResource(night ? R.drawable.ic_sun : R.drawable.ic_moon);
        btnNight.setContentDescription(getString(night ? R.string.day_mode : R.string.night_mode));
        ((android.widget.ProgressBar) spinner).setIndeterminateTintList(ColorStateList.valueOf(fg2));
        Ui.systemBars(this, !night, !barsVisible);
    }

    // ---------------------------------------------------------------- ricerca

    private void openSearch() {
        if (!opened) return;
        if (!PdfEngine.searchSupported()) {
            new AlertDialog.Builder(this)
                    .setMessage(R.string.search_unsupported)
                    .setPositiveButton(android.R.string.ok, null)
                    .show();
            return;
        }
        searchMode = true;
        queried = false;
        results.reset(false);
        if (!barsVisible) setBars(true);
        rowMain.setVisibility(View.GONE);
        rowSearch.setVisibility(View.VISIBLE);
        searchInput.setText("");
        updateCount();
        searchInput.requestFocus();
        searchInput.post(() -> {
            InputMethodManager im = getSystemService(InputMethodManager.class);
            if (im != null) im.showSoftInput(searchInput, InputMethodManager.SHOW_IMPLICIT);
        });
    }

    private void closeSearch() {
        if (!searchMode) return;
        searchMode = false;
        searchId++;                       // i risultati ancora in arrivo vengono ignorati
        if (engine != null) engine.cancelSearch();
        results.reset(false);
        pdf.clearHits();
        hideKeyboard();
        rowSearch.setVisibility(View.GONE);
        rowMain.setVisibility(View.VISIBLE);
    }

    private void startSearch() {
        String q = searchInput.getText().toString().trim();
        if (q.isEmpty() || engine == null) return;
        hideKeyboard();
        searchId++;
        queried = true;
        results.reset(true);
        pdf.clearHits();
        updateCount();
        engine.search(q, pdf.currentPage(), searchId);
    }

    private void finishSearch() {
        results.finish();
        updateCount();
        if (results.size() == 0) Toast.makeText(this, R.string.search_none, Toast.LENGTH_LONG).show();
    }

    private void stepHit(int direction) {
        SearchHit h = results.step(direction);
        if (h == null) return;
        pdf.showHit(h);
        updateCount();
    }

    private void updateCount() {
        int n = results.size();
        String t;
        if (n == 0) {
            t = results.running() ? "…" : queried ? "0" : "";
        } else {
            t = getString(R.string.search_count, results.index() + 1, n)
                    + (results.running() || results.capped() ? "+" : "");
        }
        searchCount.setText(t);
    }

    private void hideKeyboard() {
        InputMethodManager im = getSystemService(InputMethodManager.class);
        if (im != null) im.hideSoftInputFromWindow(searchInput.getWindowToken(), 0);
    }

    // Il manifest rinuncia al "back predittivo" per questa attività (enableOnBackInvokedCallback=false),
    // quindi onBackPressed viene chiamato anche su Android 16; lint non considera l'opt-out.
    @Override
    @SuppressLint("GestureBackNavigation")
    @SuppressWarnings("deprecation")
    public void onBackPressed() {
        if (searchMode) {
            closeSearch();
        } else {
            finish();
        }
    }

    // ---------------------------------------------------------------- azioni

    private void askPage() {
        if (!opened) return;
        final EditText input = new EditText(this);
        input.setInputType(InputType.TYPE_CLASS_NUMBER);
        input.setSingleLine(true);
        input.setImeOptions(EditorInfo.IME_ACTION_GO);
        input.setHint(getString(R.string.goto_hint, pageCount));
        FrameLayout box = new FrameLayout(this);
        int pad = Ui.dp(this, 24);
        box.setPadding(pad, Ui.dp(this, 8), pad, 0);
        box.addView(input);

        final AlertDialog dialog = new AlertDialog.Builder(this)
                .setTitle(R.string.goto_page)
                .setView(box)
                .setPositiveButton(R.string.go, (d, w) -> goTo(input.getText().toString()))
                .setNegativeButton(R.string.cancel, null)
                .create();
        input.setOnEditorActionListener((v, action, ev) -> {
            goTo(input.getText().toString());
            dialog.dismiss();
            return true;
        });
        dialog.getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_VISIBLE);
        dialog.show();
    }

    private void goTo(String text) {
        int p;
        try {
            p = Integer.parseInt(text.trim());
        } catch (NumberFormatException e) {
            return;
        }
        pdf.goToPage(Math.max(1, Math.min(pageCount, p)) - 1);
        if (barsVisible) setBars(false);
    }

    private void share() {
        Intent send = new Intent(Intent.ACTION_SEND)
                .setType("application/pdf")
                .putExtra(Intent.EXTRA_STREAM, uri)
                .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        send.setClipData(ClipData.newRawUri(null, uri));
        try {
            startActivity(Intent.createChooser(send, null));
        } catch (RuntimeException e) {
            Toast.makeText(this, R.string.err_share, Toast.LENGTH_SHORT).show();
        }
    }

    private String displayName(Uri u) {
        String n = null;
        try (Cursor c = getContentResolver().query(u, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null)) {
            if (c != null && c.moveToFirst()) n = c.getString(0);
        } catch (RuntimeException ignored) {
            // Provider senza nome: si usa l'ultimo segmento del percorso.
        }
        if (n == null || n.isEmpty()) n = u.getLastPathSegment();
        if (n == null || n.isEmpty()) return "PDF";
        if (n.toLowerCase(Locale.ROOT).endsWith(".pdf") && n.length() > 4) n = n.substring(0, n.length() - 4);
        return n;
    }

    // ---------------------------------------------------------------- ciclo di vita

    @Override
    protected void onStop() {
        super.onStop();
        if (opened) {
            Recents.save(this, uri.toString(), name, pdf.positionPage(), pdf.positionFrac(), pageCount);
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (engine != null) engine.close();
        if (pdf != null) pdf.release();
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        if (pdf != null && (level == ComponentCallbacks2.TRIM_MEMORY_RUNNING_CRITICAL
                || level >= ComponentCallbacks2.TRIM_MEMORY_BACKGROUND)) {
            pdf.trimMemory();
        }
    }
}
