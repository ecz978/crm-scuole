"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

const CONSENT_COOKIE = "cm_consent";

type Consent = { analytics: boolean; marketing: boolean; consentId: string };

function readConsent(): Consent | null {
  const match = document.cookie.match(new RegExp(`${CONSENT_COOKIE}=([^;]+)`));
  if (!match) return null;
  try {
    return JSON.parse(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

function writeConsent(consent: Consent) {
  document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(consent))};max-age=${60 * 60 * 24 * 365};path=/;samesite=lax`;
}

export function CookieBanner({ dict }: { dict: Dictionary["cookieBanner"] }) {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    setVisible(!readConsent());
  }, []);

  async function persist(consent: Omit<Consent, "consentId">) {
    const consentId = crypto.randomUUID();
    writeConsent({ ...consent, consentId });
    setVisible(false);
    try {
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ consentId, ...consent }),
      });
    } catch {
      // Non-blocking: the cookie itself is the source of truth for the browser.
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm text-slate-600 dark:text-slate-300">{dict.message}</p>

        {customizing && (
          <div className="mt-4 space-y-3">
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked disabled className="mt-1" />
              <span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{dict.necessaryTitle}</span>
                <span className="block text-slate-500 dark:text-slate-400">{dict.necessaryBody}</span>
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1" />
              <span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{dict.analyticsTitle}</span>
                <span className="block text-slate-500 dark:text-slate-400">{dict.analyticsBody}</span>
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1" />
              <span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{dict.marketingTitle}</span>
                <span className="block text-slate-500 dark:text-slate-400">{dict.marketingBody}</span>
              </span>
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => persist({ analytics: true, marketing: true })}
            className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
          >
            {dict.acceptAll}
          </button>
          <button
            onClick={() => persist({ analytics: false, marketing: false })}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {dict.rejectNonEssential}
          </button>
          {customizing ? (
            <button
              onClick={() => persist({ analytics, marketing })}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {dict.save}
            </button>
          ) : (
            <button
              onClick={() => setCustomizing(true)}
              className="rounded-full px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
            >
              {dict.customize}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
