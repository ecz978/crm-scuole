# Pubblicare ECZ PDF reader su Google Play: cosa fare e cosa rispondere

I nomi delle voci in Play Console cambiano nel tempo: se una non corrisponde, cerca quella simile.
Le regole (soprattutto quelle sui test per i nuovi account) vanno verificate sul momento.

## 1. Prima di iniziare

- [ ] Account sviluppatore Google Play (25 $ una tantum, verifica dell'identità).
- [ ] **Account personale:** per passare in produzione serve un test chiuso con almeno 12 tester per 14 giorni consecutivi (regola per gli account personali creati dopo novembre 2023).
      **Account organizzazione:** nessun test obbligatorio, serve il numero D-U-N-S.
- [ ] Nome del pacchetto definitivo (`applicationId`): ora è `io.github.ecz978.pdfreader`. Dopo il primo caricamento non si cambia più.
- [ ] Chiave di caricamento e segreti in GitHub (vedi sotto).
- [ ] Indirizzo email di contatto: è **pubblico** nella scheda. Inseriscilo anche in `PRIVACY.md`.
- [ ] Informativa privacy pubblicata a un indirizzo web (vedi sotto).

## 2. Creare l'app

- Nome: ECZ PDF reader. Lingua predefinita: italiano. Tipo: app (non gioco). Gratuita.
- Conferma le dichiarazioni sulle norme del programma e sui controlli per l'esportazione (l'app non usa crittografia propria).

## 3. Scheda dello store

- Testi: `listing-it.md` (predefinito) e `listing-en.md` (traduzione).
- Icona: `icon-512.png`. Immagine di copertina: `feature-graphic-1024x500.png`.
- Screenshot: almeno 2 del telefono, veri e recenti. Suggeriti: l'elenco dei recenti, una pagina in lettura, la ricerca con i risultati evidenziati, la modalità notte.
- Categoria: Strumenti. Email di contatto.

## 4. Contenuti dell'app (risposte)

| Voce | Risposta |
|---|---|
| Informativa privacy | indirizzo web di `PRIVACY.md` |
| Annunci | No, l'app non contiene annunci |
| Accesso all'app | Nessun accesso o credenziali richiesti |
| Classificazione dei contenuti (IARC) | questionario con tutte le risposte "No" (categoria: utilità/produttività) |
| Pubblico di destinazione | 18 anni e oltre, non rivolta ai bambini |
| Sicurezza dei dati | Nessun dato raccolto e nessun dato condiviso |
| ID pubblicità | No, l'app non lo usa |
| App governative, finanziarie, di salute, notizie | No a tutto |
| Dichiarazione operatore (DSA, Unione europea) | da compilare in base alla tua situazione: per un'app gratuita senza attività commerciale di norma "non operatore", ma la qualifica è una tua dichiarazione |

L'app non richiede permessi e non usa la rete: queste risposte sono coerenti con il codice.

## 5. Rilascio

1. Test chiuso (se account personale): crea la traccia, aggiungi i tester (anche amici/famiglia con account Google), caricaci il file e aspetta i 14 giorni.
2. Carica il file **.aab** (non l'APK) firmato con la chiave di caricamento. Lo produce la CI quando i segreti sono impostati.
3. Attiva Play App Signing (è l'opzione predefinita): Google custodisce la chiave di firma vera e tu usi solo la chiave di caricamento, che si può reimpostare se la perdi.
4. Compila "Novità di questa versione", controlla il riepilogo e invia in revisione. I tempi vanno da qualche ora ad alcuni giorni.

## 6. Informativa privacy online

`PRIVACY.md` (in italiano e inglese) è già pronta: dopo l'unione della PR con `main`, l'indirizzo pubblico è

`https://github.com/ecz978/crm-scuole/blob/main/android-pdf-reader/store/PRIVACY.md`

Prima di usarlo ricordati di sostituire l'email di contatto.

## 7. Chiave di caricamento e segreti GitHub

La CI firma il file di rilascio se in GitHub → Settings → Secrets and variables → Actions ci sono questi quattro segreti:

- `UPLOAD_KEYSTORE_B64`: il file della chiave codificato in base64
- `UPLOAD_KEYSTORE_PASSWORD`
- `UPLOAD_KEY_ALIAS`
- `UPLOAD_KEY_PASSWORD`

Conserva una copia sicura del file della chiave e delle password fuori da GitHub.
