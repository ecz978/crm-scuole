"use client";

import { useEffect, useRef, useState } from "react";
import type { DigitSpanItem } from "@/lib/test/types";

export function DigitSpanCard({
  item,
  onAnswer,
  instructionsLabel,
  nextLabel,
}: {
  item: DigitSpanItem;
  onAnswer: (sequence: number[], responseMs: number) => void;
  instructionsLabel: string;
  nextLabel: string;
}) {
  const [phase, setPhase] = useState<"show" | "input">("show");
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [input, setInput] = useState<number[]>([]);
  const startRef = useRef(Date.now());
  const sequence = item.sequence;

  useEffect(() => {
    setPhase("show");
    setInput([]);
    setVisibleIndex(-1);
    startRef.current = Date.now();

    let i = 0;
    const interval = setInterval(() => {
      setVisibleIndex(i);
      i++;
      if (i > sequence.length) {
        clearInterval(interval);
        setTimeout(() => setPhase("input"), 500);
      }
    }, 900);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  function submit() {
    onAnswer(input, Date.now() - startRef.current);
  }

  return (
    <div>
      <div className="flex min-h-[140px] flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/60">
        {phase === "show" ? (
          <>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{instructionsLabel}</p>
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-500 text-4xl font-bold text-white">
              {visibleIndex >= 0 && visibleIndex < sequence.length ? sequence[visibleIndex] : ""}
            </div>
          </>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: item.length }).map((_, i) => (
              <div
                key={i}
                className="flex h-14 w-12 items-center justify-center rounded-lg bg-white text-xl font-semibold text-slate-800 shadow-sm dark:bg-slate-800 dark:text-slate-100"
              >
                {input[i] ?? ""}
              </div>
            ))}
          </div>
        )}
      </div>

      {phase === "input" && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, d) => (
              <button
                key={d}
                onClick={() => input.length < item.length && setInput([...input, d])}
                className="rounded-lg border border-slate-200 bg-white py-3 text-lg font-semibold hover:border-brand-400 dark:border-slate-800 dark:bg-slate-900"
              >
                {d}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setInput(input.slice(0, -1))}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              ⌫
            </button>
            <button
              onClick={submit}
              disabled={input.length !== item.length}
              className="flex-1 rounded-full bg-brand-500 py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              {nextLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
