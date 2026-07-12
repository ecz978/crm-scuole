import type { MethodologyContent } from "./types";

const content: MethodologyContent = [
  {
    heading: "Panoramica",
    body: "CogniMetric misura sei domini cognitivi — ragionamento logico, numerico, verbale e spaziale, memoria di lavoro e velocità di elaborazione — attraverso item originali, per la maggior parte generati algoritmicamente a ogni tentativo. Le risposte vengono combinate in una stima dell'abilità pesata per difficoltà per ciascun dominio, utilizzando un modello logistico a un parametro (in stile Rasch), e convertite in un punteggio standardizzato con media 100 e deviazione standard 15, la stessa convenzione di scala utilizzata dalla maggior parte dei test di intelligenza pubblicati.",
  },
  {
    heading: "I sei domini",
    body: "Il ragionamento logico utilizza sequenze astratte di completamento di pattern costruite con forme la cui rotazione, quantità e riempimento variano secondo una o più regole simultanee.\n\nIl ragionamento numerico utilizza sequenze numeriche governate da regole aritmetiche, geometriche, alternate, quadratiche o simili a Fibonacci.\n\nIl ragionamento verbale utilizza analogie e item di individuazione dell'intruso tratti da una banca curata specifica per lingua, poiché le relazioni verbali non si traducono direttamente tra le lingue.\n\nIl ragionamento spaziale utilizza item di rotazione mentale costruiti con forme poliominiche chirali (asimmetriche), con distrattori speculari come esca classica.\n\nLa memoria di lavoro utilizza un compito di span di cifre con lunghezza della sequenza crescente tra le prove.\n\nLa velocità di elaborazione utilizza prove rapide di corrispondenza uguale/diverso tra simboli entro un tempo prestabilito.",
  },
  {
    heading: "Generazione degli item e difficoltà",
    body: "La maggior parte degli item viene generata su richiesta a partire da un seed casuale specifico per ogni tentativo, anziché essere estratta da un pool fisso e riutilizzabile. Questo limita gli effetti di memorizzazione nei tentativi ripetuti e ci consente di scalare la varietà degli item senza scriverne manualmente migliaia.\n\nOgni item porta un parametro di difficoltà assegnato per progettazione — ad esempio il numero di regole che variano simultaneamente in un item logico, l'angolo di rotazione in un item spaziale o la lunghezza della sequenza in una prova di memoria — anziché uno stimato empiricamente da un ampio campione di pretest. Si tratta di una differenza importante rispetto agli strumenti normati professionalmente, che dichiariamo qui con piena trasparenza.",
  },
  {
    heading: "Modello di calcolo del punteggio",
    body: "Per gli item logici, numerici, verbali, spaziali e di memoria, stimiamo la tua abilità (theta) con un modello logistico a un parametro: P(risposta corretta) = 1 / (1 + e^-(theta − b)), dove b è la difficoltà dell'item. Theta viene stimato tramite una breve procedura di massima verosimiglianza (Newton-Raphson) e convertito in un punteggio standardizzato come 100 + 15 × theta.\n\nIl tuo punteggio composito è la media delle stime theta su tutti e sei i domini prima della conversione, e il tuo percentile deriva dalla funzione di distribuzione cumulativa normale standard applicata a quella media.",
  },
  {
    heading: "Calcolo del punteggio per la velocità di elaborazione",
    body: "Il dominio della velocità di elaborazione misura la resa sotto pressione temporale piuttosto che la difficoltà dell'item (ogni prova ha, per progettazione, una difficoltà bassa e simile), quindi viene valutato diversamente: le risposte corrette nette (corrette meno errate) sono standardizzate rispetto a una media e deviazione standard di riferimento che abbiamo definito noi stessi, non derivate da un campione di normazione clinica. Lo dichiariamo esplicitamente perché influisce in modo sostanziale su come questo sotto-punteggio deve essere interpretato.",
  },
  {
    heading: "Controlli di affidabilità",
    body: "Ogni report include un controllo di affidabilità di base. Se più del 30% delle tue risposte a scelta multipla è stato dato in meno di 900 millisecondi — molto più veloce di quanto una lettura e un ragionamento genuini generalmente consentano — il tuo report viene contrassegnato di conseguenza, poiché tali pattern indicano spesso risposte affrettate o poco attente piuttosto che una vera stima dell'abilità.",
  },
  {
    heading: "Cosa è — e cosa non è — questo test",
    body: "CogniMetric è uno strumento autosomministrato e autocalibrato. Non è stato validato rispetto a batterie consolidate e normate professionalmente (come le scale Wechsler o le Matrici Progressive di Raven), e non è stato oggetto di studi pubblicati di affidabilità o validità su un campione di popolazione rappresentativo.\n\nPer questo motivo, il tuo punteggio va considerato una stima informativa e ricreativa — non una misurazione clinica, diagnostica o legalmente rilevante. Non deve essere utilizzato come base per decisioni di orientamento scolastico, lavorative, cliniche o legali. Se hai bisogno di una valutazione validata per uno di questi scopi, consulta uno psicologo abilitato.",
  },
  {
    heading: "Sicurezza dei dati e degli item",
    body: "Il contenuto degli item e le risposte corrette vengono generati in modo deterministico a partire da un seed memorizzato con il tuo tentativo, e vengono ricalcolati lato server al momento dell'invio per valutare le tue risposte. Questo significa che la chiave delle risposte non viene mai inviata al tuo browser e il contenuto degli item non deve essere memorizzato permanentemente — solo il tuo seed, le tue risposte e i tuoi tempi di risposta lo sono.",
  },
];

export default content;
