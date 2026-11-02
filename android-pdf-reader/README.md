# Lettore PDF

App Android per leggere PDF. Nessuna pubblicità, nessun permesso, nessun accesso alla rete.
Usa il motore PDF di sistema (`PdfRenderer`): zero librerie, APK di poche centinaia di KB.

## Funzioni

- Scroll continuo, pinch-zoom, doppio tocco per zoomare, barra di scorrimento rapido con numero di pagina
- Si apre da "Apri con" (file manager, browser, email) o dal pulsante dell'app
- Recenti con miniatura e ripresa dall'ultima pagina letta
- Vai a pagina, modalità notte (tenue, non un'inversione secca), condividi
- Schermo sempre acceso durante la lettura, tocco per nascondere le barre
- Tema chiaro/scuro di sistema, italiano e inglese

## Limiti

- Niente ricerca nel testo né selezione: `PdfRenderer` non le offre prima di Android 15
- Niente PDF protetti da password (l'app lo segnala)
- Non compila moduli e non mostra l'indice del documento

## Build

APK pronto: nella tab Actions di GitHub, job "Android PDF reader", artifact `lettore-pdf-apk`.
È firmato con la chiave di debug: si installa subito, ma ogni build ha una firma diversa
(per aggiornare sopra una versione già installata serve prima disinstallarla).
Per Play Store serve una chiave di rilascio vera.

In locale (JDK 17 + Android SDK): `./gradlew assembleRelease`.
