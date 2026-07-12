import { Suspense } from "react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";
import { ResultClient } from "@/components/test/ResultClient";

export default async function ResultPage({ params }: { params: { locale: string; attemptId: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const dict = await getDictionary(locale);

  return (
    <Suspense fallback={null}>
      <ResultClient dict={dict} locale={locale} attemptId={params.attemptId} />
    </Suspense>
  );
}
