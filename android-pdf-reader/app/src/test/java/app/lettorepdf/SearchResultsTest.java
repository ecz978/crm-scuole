package app.lettorepdf;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class SearchResultsTest {

    private static SearchHit hit(int page) {
        return new SearchHit(page, new float[]{0, 0, 1, 1});
    }

    private static List<SearchHit> hits(int... pages) {
        List<SearchHit> l = new ArrayList<>();
        for (int p : pages) l.add(hit(p));
        return l;
    }

    @Test
    public void firstArrivalBecomesCurrent() {
        SearchResults r = new SearchResults();
        r.reset(true);
        assertNull(r.current());
        assertNull(r.step(1));
        r.add(hits(7));
        assertEquals(0, r.index());
        assertEquals(7, r.current().page);
    }

    @Test
    public void finishSortsByPageAndKeepsCurrent() {
        SearchResults r = new SearchResults();
        r.reset(true);
        // si leggeva a pagina 5: arrivano 5, 8, poi il giro da 0
        r.add(hits(5, 8));
        r.add(hits(1, 3));
        SearchHit cur = r.current();
        r.finish();
        assertFalse(r.running());
        assertEquals(4, r.size());
        assertSame(cur, r.current());
        assertEquals(2, r.index());   // ordine finale 1, 3, 5, 8
        assertEquals(5, r.current().page);
    }

    @Test
    public void sortIsStableWithinAPage() {
        SearchResults r = new SearchResults();
        r.reset(true);
        SearchHit a = hit(2), b = hit(2), c = hit(1);
        r.add(Arrays.asList(a, b, c));   // il corrente è il primo arrivato: a
        r.finish();                      // ordine finale: c, a, b
        assertSame(a, r.current());
        assertSame(b, r.step(1));        // nella pagina 2 resta l'ordine di arrivo
        assertSame(c, r.step(1));        // ritorno circolare
    }

    @Test
    public void stepWrapsAround() {
        SearchResults r = new SearchResults();
        r.reset(false);
        r.add(hits(1, 2, 3));
        r.finish();
        assertEquals(1, r.current().page);
        assertEquals(3, r.step(-1).page);   // indietro dal primo: ultimo
        assertEquals(1, r.step(1).page);    // avanti dall'ultimo: primo
        assertEquals(2, r.step(1).page);
    }

    @Test
    public void capStopsAtMax() {
        SearchResults r = new SearchResults();
        r.reset(true);
        List<SearchHit> many = new ArrayList<>();
        for (int i = 0; i < SearchResults.MAX + 50; i++) many.add(hit(i));
        assertTrue(r.add(many));
        assertEquals(SearchResults.MAX, r.size());
        assertTrue(r.capped());
    }

    @Test
    public void resetClearsEverything() {
        SearchResults r = new SearchResults();
        r.reset(true);
        r.add(hits(1, 2));
        r.reset(true);
        assertEquals(0, r.size());
        assertEquals(-1, r.index());
        assertTrue(r.running());
        assertFalse(r.capped());
    }
}
