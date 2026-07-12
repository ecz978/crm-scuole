import type { LegalContent } from "./types";

const content: LegalContent = {
  privacy: {
    updated: "Ultimo aggiornamento: 12 luglio 2026",
    sections: [
      {
        heading: "Titolare del trattamento",
        body: "Il titolare del trattamento per CogniMetric è [ragione sociale — da completare prima del lancio], contattabile all'indirizzo privacy@cognimetric.example. Questa sezione deve essere completata con l'identità giuridica reale del gestore, la sede legale e, se applicabile, la Partita IVA/codice fiscale prima della messa online del sito.",
      },
      {
        heading: "Dati che raccogliamo",
        body: "Per far funzionare CogniMetric raccogliamo: (a) le tue risposte e i tempi di risposta durante il test; (b) dati tecnici come un indirizzo IP sottoposto a hash e lo user agent del browser, utilizzati solo per sicurezza di base e prevenzione delle frodi; (c) il tuo indirizzo email, solo se scegli di fornirlo per ricevere una copia del report; (d) metadati di pagamento dai nostri fornitori di servizi di pagamento (Stripe e PayPal) — non vediamo né conserviamo mai i dati della tua carta o del tuo account PayPal; (e) le tue scelte di consenso ai cookie.",
      },
      {
        heading: "Finalità e base giuridica",
        body: "Trattiamo le tue risposte al test e i dati di pagamento per l'esecuzione del contratto con te (art. 6, par. 1, lett. b, GDPR): generare il tuo report sulle capacità cognitive ed elaborare il pagamento una tantum.\n\nTrattiamo il tuo indirizzo email ed eventuali cookie analitici facoltativi solo con il tuo consenso (art. 6, par. 1, lett. a, GDPR), che puoi revocare in qualsiasi momento.\n\nTrattiamo gli indirizzi IP sottoposti a hash e i log tecnici sulla base del nostro legittimo interesse a prevenire abusi e garantire la sicurezza del servizio (art. 6, par. 1, lett. f, GDPR).",
      },
      {
        heading: "Conservazione dei dati",
        body: "Le risposte al test e i punteggi sono conservati per 24 mesi dalla data del test, dopodiché vengono cancellati, salvo richiesta di cancellazione anticipata. I dati di pagamento sono conservati per il periodo richiesto dalla normativa fiscale e contabile applicabile (fino a 10 anni) e sono custoditi dai nostri fornitori di servizi di pagamento. Gli indirizzi IP sottoposti a hash sono conservati per 30 giorni. I registri di consenso ai cookie sono conservati per 12 mesi.",
      },
      {
        heading: "Destinatari e trasferimenti internazionali",
        body: "Condividiamo i dati solo con i responsabili del trattamento strettamente necessari al funzionamento di CogniMetric: il nostro fornitore di hosting e database e i fornitori di servizi di pagamento Stripe e PayPal. Alcuni di questi fornitori possono trattare dati al di fuori dello Spazio Economico Europeo; in tal caso ci avvaliamo di garanzie adeguate come le Clausole Contrattuali Standard della Commissione Europea.",
      },
      {
        heading: "I tuoi diritti",
        body: "Ai sensi del GDPR hai il diritto di accedere, rettificare, cancellare, limitare o opporti al trattamento dei tuoi dati, nonché il diritto alla portabilità dei dati. Puoi esercitare questi diritti scrivendo a privacy@cognimetric.example. Hai inoltre il diritto di presentare reclamo alla tua autorità nazionale di protezione dei dati (in Italia, il Garante per la Protezione dei Dati Personali).",
      },
      {
        heading: "Sicurezza",
        body: "Applichiamo la minimizzazione dei dati fin dalla progettazione: non conserviamo mai indirizzi IP in chiaro, numeri di carta o credenziali PayPal, e tutto il traffico è cifrato in transito (HTTPS). L'accesso al database è limitato e i pagamenti sono gestiti interamente da fornitori conformi allo standard PCI-DSS.",
      },
      {
        heading: "Requisito di età",
        body: "CogniMetric è destinato a utenti di almeno 16 anni. Non raccogliamo consapevolmente dati da minori di 16 anni.",
      },
      {
        heading: "Modifiche a questa informativa",
        body: "Questa informativa può essere aggiornata periodicamente; la data di 'ultimo aggiornamento' sopra riportata riflette la revisione più recente. Le modifiche sostanziali saranno evidenziate in questa pagina.",
      },
    ],
  },
  cookies: {
    updated: "Ultimo aggiornamento: 12 luglio 2026",
    sections: [
      {
        heading: "Cosa sono i cookie",
        body: "I cookie sono piccoli file di testo memorizzati sul tuo dispositivo che aiutano i siti web a funzionare e, facoltativamente, a capire come vengono utilizzati.",
      },
      {
        heading: "Cookie che utilizziamo",
        body: "Strettamente necessari: cm_locale (ricorda la lingua), un cookie per il tema (ricorda la modalità chiara/scura), cm_consent (ricorda le tue scelte sui cookie) e un identificativo di sessione utilizzato per associare le tue risposte al tentativo di test e al pagamento. Sono sempre attivi perché il sito non può funzionare senza di essi.\n\nAnalitici: utilizzati solo se acconsenti tramite il banner dei cookie, per capire l'utilizzo aggregato e migliorare il sito. Nessuno viene impostato finché non fornisci il consenso.\n\nMarketing: non attualmente utilizzati su questo sito.",
      },
      {
        heading: "Cookie di terze parti",
        body: "Quando scegli di pagare, Stripe o PayPal potrebbero impostare propri cookie sulle rispettive pagine di pagamento, disciplinati dalle loro rispettive informative privacy e cookie policy.",
      },
      {
        heading: "Gestione delle preferenze",
        body: "Puoi modificare le tue scelte sui cookie in qualsiasi momento cancellando i cookie del browser per questo sito, il che farà ricomparire il banner del consenso, oppure tramite le impostazioni del tuo browser.",
      },
    ],
  },
  terms: {
    updated: "Ultimo aggiornamento: 12 luglio 2026",
    sections: [
      {
        heading: "Il servizio",
        body: "CogniMetric fornisce una valutazione online autosomministrata della performance cognitiva su sei domini, a scopo informativo e ricreativo. Non è uno strumento clinico o diagnostico.",
      },
      {
        heading: "Requisiti di ammissibilità",
        body: "Devi avere almeno 16 anni per utilizzare CogniMetric in autonomia. Sostenendo il test confermi di soddisfare questo requisito.",
      },
      {
        heading: "Prezzo e pagamento",
        body: "Il report completo ha un costo una tantum di 1,00 € (o l'equivalente mostrato al momento del pagamento), pagabile con carta, Apple Pay, Google Pay o PayPal tramite i nostri fornitori di servizi di pagamento Stripe e PayPal. Poiché il report è un contenuto digitale fornito immediatamente dopo il pagamento, prendi atto di perdere il diritto di recesso previsto dalla legge una volta sbloccato il report, in conformità con la normativa UE a tutela dei consumatori.",
      },
      {
        heading: "Rimborsi",
        body: "Poiché il report viene fornito immediatamente, i pagamenti non sono generalmente rimborsabili una volta sbloccato il report, salvo quanto previsto dalla normativa inderogabile a tutela dei consumatori o in caso di malfunzionamento tecnico a noi imputabile. Contattaci se ritieni di aver subito un addebito errato.",
      },
      {
        heading: "Uso consentito",
        body: "Ti impegni a non tentare di aggirare il sistema di pagamento, ad automatizzare o generare in massa tentativi di test, né a utilizzare il servizio per scopi illeciti.",
      },
      {
        heading: "Proprietà intellettuale",
        body: "Tutti gli item del test, la metodologia di valutazione, i testi e il design sono di proprietà di CogniMetric o dei suoi licenzianti e non possono essere copiati o ridistribuiti senza autorizzazione.",
      },
      {
        heading: "Esclusione di garanzia e limitazione di responsabilità",
        body: "Il servizio è fornito 'così com'è', senza garanzie di alcun tipo. Il punteggio di CogniMetric è una stima statistica e non deve essere utilizzato per decisioni cliniche, di orientamento scolastico, lavorative o legali. Nella misura massima consentita dalla legge, la nostra responsabilità è limitata all'importo pagato per il report.",
      },
      {
        heading: "Legge applicabile",
        body: "I presenti termini sono disciplinati dalla legge italiana, fatti salvi eventuali diritti inderogabili di tutela dei consumatori previsti dalla legge del tuo Paese di residenza.",
      },
      {
        heading: "Contatti",
        body: "Per domande su questi termini scrivi a privacy@cognimetric.example.",
      },
    ],
  },
};

export default content;
