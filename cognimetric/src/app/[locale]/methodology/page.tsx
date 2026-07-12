import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getMethodologyContent } from "@/content/methodology/get-methodology-content";
import { notFound } from "next/navigation";

export default async function MethodologyPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const [dict, sections] = await Promise.all([getDictionary(locale), getMethodologyContent(locale)]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{dict.methodology.title}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{dict.methodology.intro}</p>
      <div className="mt-8 space-y-8">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{s.heading}</h2>
            {s.body.split("\n\n").map((p, j) => (
              <p key={j} className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
