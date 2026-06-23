import "./globals.css";
import type { Metadata, Viewport } from "next";

const BASE_PATH = "/crm-scuole";

export const metadata: Metadata = {
  title: "Parole — il gioco di parole quotidiano",
  description:
    "Crea quante più parole possibili con sette lettere. Una nuova sfida ogni giorno.",
  manifest: `${BASE_PATH}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Parole",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1d4ed8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href={`${BASE_PATH}/icons/icon-192.png`} />
        <link rel="apple-touch-icon" href={`${BASE_PATH}/icons/apple-touch-icon.png`} />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', () => { navigator.serviceWorker.register('${BASE_PATH}/sw.js').catch(() => {}); }); }`,
          }}
        />
      </body>
    </html>
  );
}
