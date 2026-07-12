"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { Locale } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";
import { CreditCard, ShieldCheck } from "lucide-react";

interface ReportResponse {
  attemptId: string;
  status: string;
  paid: boolean;
  priceCents?: number;
  currency?: string;
  compositeScore?: number;
  domainScores?: Record<string, number>;
  percentile?: number;
  reliabilityFlag?: string;
}

const DOMAIN_ORDER = ["logical", "numerical", "verbal", "spatial", "memory", "speed"] as const;

export function ResultClient({ dict, locale, attemptId }: { dict: Dictionary; locale: Locale; attemptId: string }) {
  const t = dict.test;
  const h = dict.home;
  const params = useSearchParams();
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState<"stripe" | "paypal" | null>(null);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const domainLabels: Record<string, string> = {
    logical: h.domainLogicalTitle,
    numerical: h.domainNumericalTitle,
    verbal: h.domainVerbalTitle,
    spatial: h.domainSpatialTitle,
    memory: h.domainMemoryTitle,
    speed: h.domainSpeedTitle,
  };

  async function fetchReport() {
    const res = await fetch(`/api/test/report/${attemptId}`);
    const json: ReportResponse = await res.json();
    setReport(json);
    setLoading(false);
    return json;
  }

  useEffect(() => {
    const payment = params.get("payment");
    const paypalOrderId = params.get("token");

    (async () => {
      if (payment === "paypal_return" && paypalOrderId) {
        await fetch("/api/payments/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: paypalOrderId, attemptId }),
        });
        await fetchReport();
        return;
      }

      const first = await fetchReport();
      if (payment === "success" && !first.paid) {
        // Stripe webhook may lag a beat behind the redirect — poll briefly.
        for (let i = 0; i < 5 && !first.paid; i++) {
          await new Promise((r) => setTimeout(r, 1500));
          const retry = await fetchReport();
          if (retry.paid) break;
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function payWithStripe() {
    setPayLoading("stripe");
    const res = await fetch("/api/payments/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId, locale }),
    });
    const json = await res.json();
    if (json.url) window.location.href = json.url;
    else setPayLoading(null);
  }

  async function payWithPaypal() {
    setPayLoading("paypal");
    const res = await fetch("/api/payments/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId, locale }),
    });
    const json = await res.json();
    const approveUrl = json?.links?.find((l: { rel: string; href: string }) => l.rel === "approve")?.href;
    if (approveUrl) window.location.href = approveUrl;
    else setPayLoading(null);
  }

  async function sendEmail() {
    await fetch("/api/test/submit-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptId, email }),
    }).catch(() => {});
    setEmailSent(true);
  }

  if (loading || !report) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-slate-500 dark:text-slate-400">{t.processingBody}</p>
      </div>
    );
  }

  if (!report.paid) {
    const price = report.priceCents ? (report.priceCents / 100).toFixed(2) : "1.00";
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.paywallTitle}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">{t.paywallBody}</p>
        <ul className="mt-5 space-y-2 text-sm text-slate-700 dark:text-slate-300">
          {[t.paywallBullet1, t.paywallBullet2, t.paywallBullet3].map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {price} {(report.currency ?? "eur").toUpperCase() === "EUR" ? "€" : report.currency?.toUpperCase()}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{t.paywallPrice}</p>
          <div className="mt-5 space-y-2">
            <button
              onClick={payWithStripe}
              disabled={payLoading !== null}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-500 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
            >
              <CreditCard size={16} />
              {t.payWithCard}
            </button>
            <button
              onClick={payWithPaypal}
              disabled={payLoading !== null}
              className="w-full rounded-full border-2 border-[#ffc439] bg-[#ffc439] py-3 text-sm font-semibold text-slate-900 hover:brightness-95 disabled:opacity-60"
            >
              {t.payWithPaypal}
            </button>
          </div>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck size={13} /> {t.paywallSecurity}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.resultsTitle}</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{t.compositeLabel}</p>
          <p className="mt-1 text-4xl font-bold text-brand-600 dark:text-brand-400">{report.compositeScore}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/60">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">{t.percentileLabel}</p>
          <p className="mt-1 text-4xl font-bold text-brand-600 dark:text-brand-400">{report.percentile}%</p>
        </div>
      </div>
      {report.percentile !== undefined && (
        <p className="mt-3 text-center text-sm text-slate-600 dark:text-slate-400">
          {format(t.percentileBody, { percentile: report.percentile })}
        </p>
      )}

      <h2 className="mt-8 font-semibold text-slate-900 dark:text-white">{t.domainScoresTitle}</h2>
      <div className="mt-3 space-y-3">
        {DOMAIN_ORDER.map((d) => {
          const score = report.domainScores?.[d] ?? 100;
          const pct = Math.max(4, Math.min(100, ((score - 55) / 90) * 100));
          return (
            <div key={d}>
              <div className="flex justify-between text-sm text-slate-700 dark:text-slate-300">
                <span>{domainLabels[d]}</span>
                <span className="font-semibold">{score}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-2 rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <p className="font-semibold">{t.reliabilityTitle}</p>
        <p className="mt-1">{report.reliabilityFlag === "ok" ? "✓" : "⚠"} {report.reliabilityFlag}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-400">
        <p className="font-semibold text-slate-800 dark:text-slate-200">{t.disclaimerTitle}</p>
        <p className="mt-1">{t.disclaimerBody}</p>
        <p className="mt-2 text-xs">{t.retakeNotice}</p>
      </div>

      {!emailSent ? (
        <div className="mt-6 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
          <p className="font-semibold text-slate-800 dark:text-slate-200">{t.emailPromptTitle}</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{t.emailPromptBody}</p>
          <div className="mt-3 flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="flex-1 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
            />
            <button
              onClick={sendEmail}
              disabled={!email.includes("@")}
              className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              {t.emailSend}
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-emerald-600 dark:text-emerald-400">✓ {t.emailSend}</p>
      )}
    </div>
  );
}
