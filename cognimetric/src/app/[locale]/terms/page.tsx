import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLegalContent } from "@/content/legal/get-legal-content";
import { notFound } from "next/navigation";
import { LegalDocView } from "@/components/legal/LegalDocView";

export default async function TermsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const [dict, legal] = await Promise.all([getDictionary(locale), getLegalContent(locale)]);

  return <LegalDocView title={dict.legal.termsTitle} doc={legal.terms} />;
}
