package app.lettorepdf;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * Risultati di una ricerca e risultato corrente.
 *
 * La ricerca parte dalla pagina che si sta leggendo e prosegue in avanti con ritorno all'inizio:
 * i risultati arrivano quindi in questo ordine "circolare" e il primo è il più vicino. A ricerca finita
 * vengono riordinati per pagina, mantenendo il risultato corrente.
 * Classe pura (nessuna dipendenza Android) per poterla testare.
 */
final class SearchResults {

    /** Oltre questo numero la ricerca si ferma (una lettera in un libro darebbe centinaia di migliaia di risultati). */
    static final int MAX = 2000;

    private static final Comparator<SearchHit> BY_PAGE = (a, b) -> Integer.compare(a.page, b.page);

    private final ArrayList<SearchHit> hits = new ArrayList<>();
    private int index = -1;
    private boolean running;
    private boolean capped;

    void reset(boolean running) {
        hits.clear();
        index = -1;
        capped = false;
        this.running = running;
    }

    /** @return true se si è raggiunto il limite e la ricerca va interrotta. */
    boolean add(List<SearchHit> more) {
        for (SearchHit h : more) {
            if (hits.size() >= MAX) {
                capped = true;
                break;
            }
            hits.add(h);
        }
        if (hits.size() >= MAX) capped = true;
        if (index < 0 && !hits.isEmpty()) index = 0;
        return capped;
    }

    /** Ricerca terminata (o interrotta): ordina per pagina senza perdere il risultato corrente. */
    void finish() {
        running = false;
        SearchHit cur = current();
        Collections.sort(hits, BY_PAGE);   // stabile: nella stessa pagina resta l'ordine di lettura
        index = cur == null ? -1 : hits.indexOf(cur);
    }

    SearchHit current() {
        return index >= 0 && index < hits.size() ? hits.get(index) : null;
    }

    /** Sposta il risultato corrente di +1 / -1 con ritorno circolare. */
    SearchHit step(int direction) {
        int n = hits.size();
        if (n == 0) return null;
        index = ((index < 0 ? 0 : index) + direction + n) % n;
        return hits.get(index);
    }

    int size() {
        return hits.size();
    }

    /** Posizione 0-based del risultato corrente, -1 se non c'è. */
    int index() {
        return index;
    }

    boolean running() {
        return running;
    }

    boolean capped() {
        return capped;
    }
}
