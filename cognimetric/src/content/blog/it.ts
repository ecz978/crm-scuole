import type { BlogContent } from "./types";

const content: BlogContent = [
  {
    slug: "interpretare-il-tuo-punteggio",
    title: "Come interpretare il tuo punteggio CogniMetric",
    excerpt:
      "Il tuo punteggio composito non è un'etichetta fissa: ecco cosa significano davvero i numeri del tuo report CogniMetric, e cosa no.",
    publishedAt: "2026-06-02",
    paragraphs: [
      "Se hai appena completato un test CogniMetric, stai guardando un punteggio composito costruito attorno a una media di 100 e a una deviazione standard di 15 — la stessa convenzione usata dalla maggior parte delle scale di abilità cognitiva pubblicate. Un punteggio di 100 si colloca esattamente al centro della distribuzione di riferimento; un punteggio di 115 si colloca una deviazione standard sopra di essa, e così via.",
      "Il valore percentile accanto al tuo punteggio composito risponde a una domanda più intuitiva: su tutte le persone nella distribuzione di riferimento, quale frazione ha ottenuto un punteggio inferiore al tuo? Un percentile di 84 significa che la tua stima composita ti colloca sopra circa l'84% di quella distribuzione — non che hai risposto correttamente all'84% degli item.",
      "Vale la pena ripetere ciò che il disclaimer sul tuo report dice già: questa distribuzione di riferimento è un costrutto matematico basato sulla nostra progettazione della difficoltà degli item, non un campione empirico di migliaia di persone che hanno realmente sostenuto il test. Gli strumenti normati professionalmente impiegano anni a raccogliere campioni rappresentativi per età, istruzione e area geografica prima di pubblicare le norme. CogniMetric non ha questo dietro di sé, e crediamo che tu meriti di saperlo con chiarezza.",
      "Questo non rende il numero privo di significato — la stima sottostante in stile Rasch è una tecnica psicometrica legittima e ampiamente utilizzata, e i tuoi sei punteggi di dominio riflettono davvero differenze genuine in come hai performato negli item logici, numerici, verbali, spaziali, di memoria e di velocità. Significa solo che il numero va letto al meglio come una stima strutturata e autoreferenziale della tua performance su questo specifico strumento, non come un punteggio di QI certificato.",
      "Alcune note pratiche: la performance può variare in modo significativo in base a sonno, stress, ora del giorno e semplice pratica con i formati degli item — ed è proprio per questo che suggeriamo di attendere qualche mese tra un tentativo e l'altro, invece di considerare come cambiamento reale piccole fluttuazioni quotidiane. E se un singolo punteggio di dominio appare come un valore anomalo rispetto al resto del tuo profilo, spesso è più utile riflettere su cosa sia successo in quella specifica sezione piuttosto che dare troppo peso al numero da solo.",
    ],
  },
  {
    slug: "intelligenza-fluida-e-cristallizzata",
    title: "Intelligenza fluida e cristallizzata: cosa significano davvero i tuoi sei punteggi di dominio",
    excerpt:
      "Perché CogniMetric non ti restituisce un solo numero, ma sei — e come i punteggi logico, numerico, verbale, spaziale, di memoria e di velocità si collegano a un'idea molto più antica della psicologia.",
    publishedAt: "2026-06-16",
    paragraphs: [
      "Molto prima che esistessero i test online adattivi, gli psicologi Raymond Cattell e John Horn proposero di dividere l'intelligenza in due grandi categorie: l'intelligenza fluida — la capacità di ragionare e risolvere problemi nuovi senza fare affidamento su conoscenze pregresse — e l'intelligenza cristallizzata — la conoscenza accumulata e l'abilità verbale costruite nel corso della vita. John Carroll in seguito integrò entrambe in un modello più ampio a tre strati che ancora oggi sta alla base della maggior parte delle batterie di test cognitivi moderne.",
      "I domini logico, numerico e spaziale di CogniMetric si basano fortemente sul ragionamento fluido: nessuno di essi richiede vocabolario specializzato o conoscenze culturali, solo la capacità di individuare una regola in un pattern non familiare e applicarla. Il nostro dominio verbale, al contrario, si basa sull'abilità cristallizzata — dipende direttamente dal vocabolario e dalle relazioni che hai già appreso nella tua lingua, ed è anche per questo che non abbiamo potuto semplicemente tradurre gli stessi item in cinque lingue, ma abbiamo dovuto scrivere una banca separata e specifica per ciascuna lingua.",
      "La memoria di lavoro e la velocità di elaborazione si collocano leggermente al di fuori della distinzione fluida/cristallizzata. La memoria di lavoro — la tua capacità di mantenere e manipolare brevemente alcuni elementi nella mente, qui testata con un compito di span di cifre — è spesso considerata una risorsa di base su cui si appoggiano sia la performance fluida sia quella cristallizzata. La velocità di elaborazione, testata con la corrispondenza rapida di simboli, cattura qualcosa di ancora più elementare: quanto velocemente riesci a eseguire semplici decisioni percettive sotto pressione temporale, indipendentemente da quanto sia difficile la decisione in sé.",
      "Vedere i tuoi risultati suddivisi in questo modo è più utile di un singolo numero composito, perché i profili cognitivi reali sono raramente piatti. È comune essere notevolmente più forti nel ragionamento fluido basato su pattern che nell'ampiezza della memoria di lavoro, o viceversa — ed è proprio questo tipo di irregolarità che un singolo punteggio complessivo nasconderebbe.",
      "Nulla di tutto ciò trasforma CogniMetric in uno strumento diagnostico — consulta la nostra pagina Metodologia per i limiti importanti — ma il quadro fluido/cristallizzato è una lente davvero utile per capire perché i tuoi sei punteggi di dominio non si muovono sempre insieme.",
    ],
  },
];

export default content;
