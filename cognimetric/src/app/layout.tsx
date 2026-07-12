import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CogniMetric",
};

// The middleware redirects every request to a /[locale] path, so this root
// layout only needs to pass children through — the real <html>/<body> tags
// live in src/app/[locale]/layout.tsx where the locale and theme are known.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
