import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const dict = await getDictionary(params.locale);
  return {
    title: { default: dict.common.siteName, template: `%s · ${dict.common.siteName}` },
    description: dict.common.tagline,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = await getDictionary(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col">
            <Nav dict={dict} locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer dict={dict} locale={locale} />
          </div>
          <CookieBanner dict={dict.cookieBanner} />
        </ThemeProvider>
      </body>
    </html>
  );
}
