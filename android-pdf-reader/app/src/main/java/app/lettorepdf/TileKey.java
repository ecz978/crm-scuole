package app.lettorepdf;

/**
 * Identifica una bitmap renderizzata.
 * level 0: pagina intera alla risoluzione dello schermo (x = y = 0).
 * level &gt; 0: tessera (x, y) di {@link PdfEngine#TILE} px con zoom = level / 4.
 */
final class TileKey {
    final int page, level, x, y;

    TileKey(int page, int level, int x, int y) {
        this.page = page;
        this.level = level;
        this.x = x;
        this.y = y;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TileKey)) return false;
        TileKey k = (TileKey) o;
        return page == k.page && level == k.level && x == k.x && y == k.y;
    }

    @Override
    public int hashCode() {
        int h = page;
        h = h * 31 + level;
        h = h * 31 + x;
        h = h * 31 + y;
        return h;
    }
}
