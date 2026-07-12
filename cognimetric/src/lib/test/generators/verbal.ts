import { shuffle } from "../rng";
import type { ScoredChoiceItem } from "../types";
import type { Locale } from "../../i18n/config";
import itBank from "../verbal-bank/it";
import enBank from "../verbal-bank/en";
import esBank from "../verbal-bank/es";
import frBank from "../verbal-bank/fr";
import deBank from "../verbal-bank/de";
import type { VerbalBankItem } from "../verbal-bank/types";

const BANKS: Record<Locale, VerbalBankItem[]> = {
  it: itBank,
  en: enBank,
  es: esBank,
  fr: frBank,
  de: deBank,
};

export function generateVerbalItems(rand: () => number, locale: Locale, count: number): ScoredChoiceItem[] {
  const bank = BANKS[locale] ?? BANKS.en;
  const chosen = shuffle(rand, bank).slice(0, count);

  return chosen.map((entry) => {
    const correctText = entry.options[entry.correctIndex];
    const shuffledOptions = shuffle(rand, entry.options);
    const correctIndex = shuffledOptions.findIndex((o) => o === correctText);

    return {
      kind: "choice",
      id: entry.id,
      domain: "verbal",
      prompt: { kind: "text", text: entry.prompt },
      options: shuffledOptions.map((text) => ({ kind: "text" as const, text })),
      correctIndex,
      difficulty: entry.difficulty,
    };
  });
}
