import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";
import { ShieldCheck, Lock, Sparkles, ArrowRight, Brain, Calculator, MessageSquare, Shapes, ListOrdered, Zap } from "lucide-react";

export default async function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const t = await getDictionary(locale);
  const h = t.home;

  const domains = [
    { icon: Brain, title: h.domainLogicalTitle, body: h.domainLogicalBody },
    { icon: Calculator, title: h.domainNumericalTitle, body: h.domainNumericalBody },
    { icon: MessageSquare, title: h.domainVerbalTitle, body: h.domainVerbalBody },
    { icon: Shapes, title: h.domainSpatialTitle, body: h.domainSpatialBody },
    { icon: ListOrdered, title: h.domainMemoryTitle, body: h.domainMemoryBody },
    { icon: Zap, title: h.domainSpeedTitle, body: h.domainSpeedBody },
  ];

  const steps = [
    { title: h.step1Title, body: h.step1Body },
    { title: h.step2Title, body: h.step2Body },
    { title: h.step3Title, body: h.step3Body },
    { title: h.step4Title, body: h.step4Body },
  ];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-950" />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300">
            <Sparkles size={13} /> {h.heroEyebrow}
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl">{h.heroTitle}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">{h.heroSubtitle}</p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <Link
              href={`/${locale}/test`}
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600"
            >
              {h.heroCta} <ArrowRight size={18} />
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400">{h.heroPriceNote}</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 text-left text-xs text-slate-500 dark:text-slate-400 sm:grid-cols-4">
            {[h.trust1, h.trust2, h.trust3, h.trust4].map((trust, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {i === 0 ? <ShieldCheck size={14} className="shrink-0 text-brand-500" /> : <Lock size={14} className="shrink-0 text-brand-500" />}
                {trust}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">{h.howItWorksTitle}</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">{h.domainsTitle}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-slate-600 dark:text-slate-400">{h.domainsSubtitle}</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {domains.map((d, i) => {
              const Icon = d.icon;
              return (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
                  <Icon className="text-brand-500" size={22} />
                  <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{d.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{d.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{h.ctaTitle}</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">{h.ctaBody}</p>
        <Link
          href={`/${locale}/test`}
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand-500/20 hover:bg-brand-600"
        >
          {h.ctaButton} <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
}
