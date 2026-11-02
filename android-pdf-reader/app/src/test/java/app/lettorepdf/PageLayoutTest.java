package app.lettorepdf;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public class PageLayoutTest {

    private static PageLayout threePages() {
        PageLayout l = new PageLayout();
        l.init(3, 100f, 200f);
        l.layout(1000f, 10f, 20f, 30f);
        return l;
    }

    @Test
    public void positionsFollowAspectRatio() {
        PageLayout l = threePages();
        assertEquals(2000f, l.height(0), 0.001f);
        assertEquals(20f, l.top(0), 0.001f);
        assertEquals(2030f, l.top(1), 0.001f);
        assertEquals(4040f, l.top(2), 0.001f);
        assertEquals(6070f, l.total(), 0.001f);
    }

    @Test
    public void pageAtIsClampedAndGapBelongsToPreviousPage() {
        PageLayout l = threePages();
        assertEquals(0, l.pageAt(-50f));
        assertEquals(0, l.pageAt(0f));
        assertEquals(0, l.pageAt(2025f));
        assertEquals(1, l.pageAt(2030f));
        assertEquals(2, l.pageAt(1e9f));
    }

    @Test
    public void mixedSizesChangeLayout() {
        PageLayout l = threePages();
        assertFalse(l.setSize(1, 100.2f, 200.1f));   // differenza trascurabile
        assertTrue(l.setSize(1, 200f, 100f));        // pagina orizzontale
        l.layout(1000f, 10f, 20f, 30f);
        assertEquals(500f, l.height(1), 0.001f);
        assertEquals(2030f + 500f + 10f, l.top(2), 0.001f);
    }

    @Test
    public void invalidSizesAreIgnored() {
        PageLayout l = threePages();
        assertFalse(l.setSize(0, 0f, 10f));
        assertFalse(l.setSize(5, 10f, 10f));
        assertFalse(l.setSize(1, Float.NaN, 10f));
    }

    @Test
    public void emptyDocument() {
        PageLayout l = new PageLayout();
        l.init(0, 100f, 100f);
        l.layout(500f, 8f, 10f, 10f);
        assertEquals(0, l.pageAt(100f));
        assertEquals(20f, l.total(), 0.001f);
    }
}
