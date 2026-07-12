"use client";

import { useEffect, useRef, useState } from "react";
import type { SymbolMatchItem } from "@/lib/test/types";

export interface SpeedAnswer {
  itemId: string;
  boolAnswer: boolean;
  responseMs: number;
}

export function SpeedSection({
  items,
  timeLimitSeconds,
  sameLabel,
  differentLabel,
  timeRemainingLabel,
  onComplete,
}: {
  items: SymbolMatchItem[];
  timeLimitSeconds: number;
  sameLabel: string;
  differentLabel: string;
  timeRemainingLabel: string;
  onComplete: (answers: SpeedAnswer[]) => void;
}) {
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(timeLimitSeconds);
  const answersRef = useRef<SpeedAnswer[]>([]);
  const itemStartRef = useRef(Date.now());
  const doneRef = useRef(false);

  useEffect(() => {
    itemStartRef.current = Date.now();
  }, [index]);

  useEffect(() => {
    const tick = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(tick);
          finish();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function finish() {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete(answersRef.current);
  }

  function answer(value: boolean) {
    if (doneRef.current) return;
    const item = items[index];
    answersRef.current.push({ itemId: item.id, boolAnswer: value, responseMs: Date.now() - itemStartRef.current });
    if (index + 1 >= items.length) {
      finish();
    } else {
      setIndex(index + 1);
    }
  }

  const item = items[index];
  if (!item) return null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <span>
          {index + 1} / {items.length}
        </span>
        <span className="font-mono">
          {timeRemainingLabel}: {remaining}s
        </span>
      </div>
      <div className="flex min-h-[140px] items-center justify-center gap-10 rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/60">
        <div className="flex gap-1 text-3xl">
          {item.left.map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
        <div className="h-10 w-px bg-slate-300 dark:bg-slate-700" />
        <div className="flex gap-1 text-3xl">
          {item.right.map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => answer(true)}
          className="rounded-full border-2 border-emerald-300 bg-emerald-50 py-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
        >
          {sameLabel}
        </button>
        <button
          onClick={() => answer(false)}
          className="rounded-full border-2 border-rose-300 bg-rose-50 py-4 text-sm font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
        >
          {differentLabel}
        </button>
      </div>
    </div>
  );
}
