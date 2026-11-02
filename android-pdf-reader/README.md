# ECZ PDF reader

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

## Avvisi di Android all'installazione

Un APK installato fuori da uno store mostra sempre qualche avviso: nessuna impostazione della build lo elimina.

- **"Installa app sconosciute":** è un permesso che si dà all'app da cui si apre il file (browser, gestore file). Serve per qualsiasi APK fuori da uno store.
- **Avvisi di Play Protect ("app mai vista", "sviluppatore non verificato"):** dipendono dalla reputazione della firma e dello sviluppatore. Si riducono firmando sempre con la **stessa chiave vera** (non quella di debug, diversa a ogni build), scegliendo "Invia per la scansione" al primo avviso e, soprattutto, **installando da uno store** (Google Play, F-Droid, Galaxy Store), dove questi avvisi non compaiono.
- **Verifica degli sviluppatori di Google:** introdotta dal 2026 per le app su dispositivi certificati, con un account gratuito limitato per hobbisti. Controlla lo stato nella console per sviluppatori Android.

La firma con una chiave vera si attiva impostando quattro segreti in GitHub (vedi `store/PLAY-CONSOLE.md`, sezione 7): la CI firma allora sia l'APK sia il bundle per Play.

## Licenza

Software libero, [GNU GPL v3 o successiva](LICENSE). Copyright (C) 2026 ecz978.

## Distribuzione

- GitHub Releases: APK per l'installazione diretta.
- F-Droid: vedi [FDROID.md](FDROID.md).
- Google Play: vedi [store/PLAY-CONSOLE.md](store/PLAY-CONSOLE.md).
