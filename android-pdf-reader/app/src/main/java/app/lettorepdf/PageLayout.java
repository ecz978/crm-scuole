package app.lettorepdf;

import java.util.Arrays;

/**
 * Geometria delle pagine in scroll verticale continuo.
 * A zoom 1 ogni pagina è larga quanto la vista; l'altezza segue le proporzioni del PDF.
 * Classe pura (nessuna dipendenza Android) per poterla testare.
 */
final class PageLayout {
    private float[] ptW = new float[0];
    private float[] ptH = new float[0];
    private float[] top = new float[0];
    private float[] height = new float[0];
    private float width;
    private float total;
    private int count;

    /** Imposta il numero di pagine, tutte provvisoriamente della stessa dimensione (in punti PDF). */
    void init(int count, float w, float h) {
        this.count = count;
        ptW = new float[count];
        ptH = new float[count];
        top = new float[count];
        height = new float[count];
        Arrays.fill(ptW, sane(w));
        Arrays.fill(ptH, sane(h));
        width = 0;
        total = 0;
    }

    /** @return true se la dimensione è cambiata in modo apprezzabile. */
    boolean setSize(int i, float w, float h) {
        if (i < 0 || i >= count || !(w > 0) || !(h > 0)) return false;
        if (Math.abs(ptW[i] - w) < 0.5f && Math.abs(ptH[i] - h) < 0.5f) return false;
        ptW[i] = w;
        ptH[i] = h;
        return true;
    }

    /** Calcola le posizioni. {@code padTop}/{@code padBottom} sono lo spazio prima e dopo la prima/ultima pagina. */
    void layout(float width, float gap, float padTop, float padBottom) {
        this.width = width;
        float y = padTop;
        for (int i = 0; i < count; i++) {
            top[i] = y;
            height[i] = width * ptH[i] / ptW[i];
            y += height[i] + gap;
        }
        total = count == 0 ? padTop + padBottom : y - gap + padBottom;
    }

    int count() { return count; }

    float width() { return width; }

    float total() { return total; }

    float top(int i) { return top[i]; }

    float height(int i) { return height[i]; }

    /** Dimensioni della pagina in punti PDF. */
    float ptWidth(int i) { return ptW[i]; }

    float ptHeight(int i) { return ptH[i]; }

    /** Indice della pagina che contiene y (lo spazio tra due pagine appartiene alla precedente). */
    int pageAt(float y) {
        if (count == 0) return 0;
        int lo = 0, hi = count - 1;
        while (lo < hi) {
            int mid = (lo + hi + 1) >>> 1;
            if (top[mid] <= y) lo = mid; else hi = mid - 1;
        }
        return lo;
    }

    private static float sane(float v) {
        return v > 0 ? v : 1f;
    }
}
