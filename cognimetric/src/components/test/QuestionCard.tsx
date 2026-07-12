"use client";

import { useEffect, useRef, useState } from "react";
import type { ChoiceItem } from "@/lib/test/types";
import { ShapeGlyph } from "./ShapeGlyph";
import { PolyShape } from "./PolyShape";
import { OptionButton } from "./OptionButton";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

export function QuestionCard({
  item,
  onAnswer,
  nextLabel,
}: {
  item: ChoiceItem;
  onAnswer: (choiceIndex: number, responseMs: number) => void;
  nextLabel: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    setSelected(null);
  }, [item.id]);

  function submit() {
    if (selected === null) return;
    onAnswer(selected, Date.now() - startRef.current);
  }

  return (
    <div>
      <div className="flex min-h-[140px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-800 dark:bg-slate-900/60">
        {item.prompt.kind === "sequence" && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {item.prompt.sequence.map((s, i) => (
              <ShapeGlyph key={i} spec={s} />
            ))}
            <div className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-xl font-semibold text-slate-400 dark:border-slate-700">
              ?
            </div>
          </div>
        )}
        {item.prompt.kind === "numberSequence" && (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {item.prompt.sequence.map((n, i) =>
              n === null ? (
                <div
                  key={i}
                  className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-xl font-semibold text-slate-400 dark:border-slate-700"
                >
                  ?
                </div>
              ) : (
                <div
                  key={i}
                  className="flex h-14 w-14 items-center justify-center rounded-lg bg-white text-xl font-semibold text-slate-800 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                >
                  {n}
                </div>
              )
            )}
          </div>
        )}
        {item.prompt.kind === "text" && (
          <p className="max-w-xl text-center text-xl font-medium text-slate-800 dark:text-slate-100">{item.prompt.text}</p>
        )}
        {item.prompt.kind === "target" && <PolyShape spec={item.prompt.target} size={96} />}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {item.options.map((opt, i) => (
          <OptionButton key={i} option={opt} selected={selected === i} onClick={() => setSelected(i)} label={OPTION_LABELS[i]} />
        ))}
      </div>

      <button
        onClick={submit}
        disabled={selected === null}
        className="mt-6 w-full rounded-full bg-brand-500 py-3 text-sm font-semibold text-white transition-opacity hover:bg-brand-600 disabled:opacity-40 sm:w-auto sm:px-8"
      >
        {nextLabel}
      </button>
    </div>
  );
}
