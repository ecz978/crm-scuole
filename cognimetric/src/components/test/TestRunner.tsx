"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { Locale } from "@/lib/i18n/config";
import type { ChoiceItem, DigitSpanItem, Domain, SymbolMatchItem, TestItem, DomainConfig } from "@/lib/test/types";
import { DOMAINS } from "@/lib/test/types";
import { QuestionCard } from "./QuestionCard";
import { DigitSpanCard } from "./DigitSpanCard";
import { SpeedSection, type SpeedAnswer } from "./SpeedSection";
import { format } from "@/lib/i18n/format";

type Phase = "consent" | "intro" | "running" | "submitting";

interface StartResponse {
  attemptId: string;
  domains: Domain[];
  domainConfig: Record<Domain, DomainConfig>;
  items: Record<Domain, TestItem[]>;
}

interface AnswerRecord {
  itemId: string;
  domain: Domain;
  responseMs: number;
  choiceIndex?: number;
  sequence?: number[];
  boolAnswer?: boolean;
}

export function TestRunner({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("consent");
  const [consented, setConsented] = useState(false);
  const [showDeclined, setShowDeclined] = useState(false);
  const [data, setData] = useState<StartResponse | null>(null);
  const [domainIndex, setDomainIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const answersRef = useRef<AnswerRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  const t = dict.test;
  const domain = data?.domains[domainIndex];

  const domainMeta = useMemo(
    () => ({
      logical: { title: dict.home.domainLogicalTitle, body: dict.home.domainLogicalBody },
      numerical: { title: dict.home.domainNumericalTitle, body: dict.home.domainNumericalBody },
      verbal: { title: dict.home.domainVerbalTitle, body: dict.home.domainVerbalBody },
      spatial: { title: dict.home.domainSpatialTitle, body: dict.home.domainSpatialBody },
      memory: { title: dict.home.domainMemoryTitle, body: dict.home.domainMemoryBody },
      speed: { title: dict.home.domainSpeedTitle, body: dict.home.domainSpeedBody },
    }),
    [dict]
  );

  async function startTest() {
    if (!consented) {
      setShowDeclined(true);
      return;
    }
    const res = await fetch("/api/test/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale }),
    });
    const json: StartResponse = await res.json();
    setData(json);
    setDomainIndex(0);
    setItemIndex(0);
    setPhase("intro");
  }

  function beginSection() {
    if (!data || !domain) return;
    setRemaining(data.domainConfig[domain].timeLimitSeconds);
    setPhase("running");
  }

  // Per-section countdown; forces an advance to the next section if it elapses.
  useEffect(() => {
    if (phase !== "running" || domain === "speed") return;
    const interval = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(interval);
          advanceDomain();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, domainIndex]);

  function advanceDomain() {
    if (!data) return;
    if (domainIndex + 1 >= data.domains.length) {
      void submit();
    } else {
      setDomainIndex(domainIndex + 1);
      setItemIndex(0);
      setPhase("intro");
    }
  }

  function recordAnswer(record: AnswerRecord) {
    answersRef.current.push(record);
    if (!data || !domain) return;
    if (itemIndex + 1 >= data.domainConfig[domain].itemCount) {
      advanceDomain();
    } else {
      setItemIndex(itemIndex + 1);
    }
  }

  function recordSpeedAnswers(speedAnswers: SpeedAnswer[]) {
    for (const a of speedAnswers) {
      answersRef.current.push({ itemId: a.itemId, domain: "speed", responseMs: a.responseMs, boolAnswer: a.boolAnswer });
    }
    advanceDomain();
  }

  async function submit() {
    if (!data) return;
    setPhase("submitting");
    try {
      const res = await fetch("/api/test/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId: data.attemptId, answers: answersRef.current }),
      });
      if (!res.ok) throw new Error("submit_failed");
      router.push(`/${locale}/test/result/${data.attemptId}`);
    } catch {
      setError("submit_failed");
    }
  }

  if (phase === "consent") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.consentTitle}</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">{t.consentIntro}</p>
        <ul className="mt-6 space-y-3 text-sm text-slate-700 dark:text-slate-300">
          {[t.consentPoint1, t.consentPoint2, t.consentPoint3, t.consentPoint4].map((p, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              {p}
            </li>
          ))}
        </ul>
        <label className="mt-6 flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            checked={consented}
            onChange={(e) => {
              setConsented(e.target.checked);
              setShowDeclined(false);
            }}
            className="mt-1"
          />
          {t.consentCheckbox}
        </label>
        {showDeclined && <p className="mt-2 text-sm text-rose-500">{t.consentDeclined}</p>}
        <button
          onClick={startTest}
          className="mt-6 rounded-full bg-brand-500 px-7 py-3 text-sm font-semibold text-white hover:bg-brand-600"
        >
          {t.consentCta}
        </button>
      </div>
    );
  }

  if (phase === "intro" && domain) {
    const meta = domainMeta[domain];
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-500">
          {domainIndex + 1} / {data?.domains.length}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{meta.title}</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">{meta.body}</p>
        <button
          onClick={beginSection}
          className="mt-8 rounded-full bg-brand-500 px-7 py-3 text-sm font-semibold text-white hover:bg-brand-600"
        >
          {t.domainIntroCta}
        </button>
      </div>
    );
  }

  if (phase === "running" && domain && data) {
    if (domain === "speed") {
      const items = data.items.speed as SymbolMatchItem[];
      return (
        <div className="mx-auto max-w-xl px-4 py-12">
          <SpeedSection
            items={items}
            timeLimitSeconds={data.domainConfig.speed.timeLimitSeconds}
            sameLabel={t.same}
            differentLabel={t.different}
            timeRemainingLabel={t.timeRemaining}
            onComplete={recordSpeedAnswers}
          />
        </div>
      );
    }

    const items = data.items[domain];
    const item = items[itemIndex];

    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <div className="mb-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>{format(t.questionOf, { current: itemIndex + 1, total: items.length })}</span>
          <span className="font-mono">
            {t.timeRemaining}: {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
          </span>
        </div>
        {item.kind === "digitSpan" ? (
          <DigitSpanCard
            item={item as DigitSpanItem}
            instructionsLabel={t.instructionsTitle}
            nextLabel={t.next}
            onAnswer={(sequence, responseMs) =>
              recordAnswer({ itemId: item.id, domain, responseMs, sequence })
            }
          />
        ) : (
          <QuestionCard
            item={item as ChoiceItem}
            nextLabel={t.next}
            onAnswer={(choiceIndex, responseMs) => recordAnswer({ itemId: item.id, domain, responseMs, choiceIndex })}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{t.processingTitle}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{t.processingBody}</p>
      {error && <p className="mt-4 text-sm text-rose-500">{error}</p>}
    </div>
  );
}
