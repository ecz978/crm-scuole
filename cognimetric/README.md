# CogniMetric

Sito per un test del QI online: 6 domini cognitivi (logico, numerico, verbale, spaziale, memoria di lavoro, velocità di elaborazione), punteggio standardizzato (media 100, DS 15), report a pagamento (1,00 €), in 5 lingue con rilevamento automatico (IT/EN/ES/FR/DE), tema chiaro/scuro, GDPR e cookie banner, sezione metodologia e blog.

Progetto Next.js 14 (App Router) indipendente, con Prisma + Postgres.

## Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS (dark mode via classe, `next-themes`)
- Prisma + PostgreSQL (Vercel Postgres o Neon)
- Stripe (carte, Apple Pay, Google Pay) + PayPal (Orders API v2)
- i18n custom (middleware + dizionari), nessuna dipendenza esterna

## Sviluppo locale

```bash
cd cognimetric
cp .env.example .env.local   # poi compila le variabili, vedi sotto
npm install
npm run db:push              # crea le tabelle sul database configurato in DATABASE_URL
npm run dev
```

## Variabili d'ambiente da configurare prima del lancio

Vedi `.env.example` per l'elenco completo. In sintesi:

1. **Database** — crea un database Postgres (Vercel Postgres o Neon) e imposta `DATABASE_URL` / `DATABASE_URL_UNPOOLED`.
2. **Stripe** — crea un account su dashboard.stripe.com, copia `STRIPE_SECRET_KEY` e `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, configura un webhook verso `/api/payments/stripe/webhook` per l'evento `checkout.session.completed` e copia `STRIPE_WEBHOOK_SECRET`.
3. **PayPal** — crea un'app su developer.paypal.com, copia `PAYPAL_CLIENT_ID` e `PAYPAL_CLIENT_SECRET`. Usa `PAYPAL_ENV=sandbox` finché non sei pronto per il live.
4. **Prezzo del report** — `TEST_REPORT_PRICE_CENTS=100` (1,00 €), modificabile.

## Cosa completare prima di andare online (azioni per il gestore del sito)

- **Identità legale**: nei file `src/content/legal/{it,en,es,fr,de}.ts`, sezione "Data controller"/"Titolare del trattamento", sostituire `[ragione sociale — da completare prima del lancio]` con i dati reali (nome legale, indirizzo, P.IVA/CF) e un indirizzo email reale al posto di `privacy@cognimetric.example`.
- **Dominio**: aggiornare `NEXT_PUBLIC_APP_URL` con il dominio definitivo (usato per i redirect di Stripe/PayPal).
- **Email di invio report**: l'endpoint `/api/test/submit-email` oggi salva solo l'email nel database; per l'invio effettivo del PDF collegare un provider come Resend (`RESEND_API_KEY` già previsto in `.env.example`) o simile.
- **Passare da sandbox a produzione** su Stripe e PayPal quando pronti.

## Struttura del motore del test

Gli item vengono generati proceduralmente da un seed per-tentativo (`src/lib/test/build-attempt.ts`), così il server non deve mai memorizzare il contenuto degli item né le risposte corrette: rigenera tutto dal seed al momento della correzione (`src/lib/test/grade-attempt.ts`). Il punteggio usa una stima di abilità in stile Rasch (`src/lib/test/scoring.ts`). Dettagli completi nella pagina `/metodologia` del sito.

## Deploy

Pensato per Vercel: collega questa cartella come root del progetto (Root Directory: `cognimetric`), aggiungi le variabili d'ambiente sopra elencate, collega un database Postgres e fai il deploy.
