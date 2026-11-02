package app.lettorepdf;

/**
 * Un risultato di ricerca: pagina e rettangoli (in punti PDF, origine in alto a sinistra).
 * Un risultato su più righe ha più rettangoli. {@code rects} è piatto: left, top, right, bottom, ...
 */
final class SearchHit {
    final int page;
    final float[] rects;

    SearchHit(int page, float[] rects) {
        this.page = page;
        this.rects = rects;
    }
}
