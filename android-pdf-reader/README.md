# Lettore PDF

App Android per leggere PDF. Nessuna pubblicità, nessun permesso, nessun accesso alla rete.
Usa il motore PDF di sistema (`PdfRenderer`): zero librerie, APK di poche centinaia di KB.

## Funzioni

- Scroll continuo, pinch-zoom, doppio tocco per zoomare, barra di scorrimento rapido con numero di pagina
- Si apre da "Apri con" (file manager, browser, email) o dal pulsante dell'app
- Recenti con miniatura e ripresa dall'ultima pagina letta
- Ricerca nel testo con evidenziazione e navigazione tra i risultati (vedi limiti)
- Vai a pagina, modalità notte (tenue, non un'inversione secca), condividi
- Schermo sempre acceso durante la lettura, tocco per nascondere le barre
- Tema chiaro/scuro di sistema, italiano e inglese

## Limiti

- La ricerca nel testo usa quella di sistema: serve Android 15 o un Android 12-14 con aggiornamenti recenti (SDK extension 13). Altrove l'app lo dice e il resto funziona. Non cerca nei PDF scansionati (niente testo) e non c'è selezione del testo
- Niente PDF protetti da password (l'app lo segnala)
- Non compila moduli e non mostra l'indice del documento

## Build

APK pronto: nella tab Actions di GitHub, job "Android PDF reader", artifact `lettore-pdf-apk`.
È firmato con la chiave di debug: si installa subito, ma ogni build ha una firma diversa
(per aggiornare sopra una versione già installata serve prima disinstallarla).
Per Play Store serve una chiave di rilascio vera.

In locale (JDK 17 + Android SDK): `./gradlew assembleRelease`.
