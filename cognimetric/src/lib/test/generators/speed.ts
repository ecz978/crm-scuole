import { randInt, shuffle } from "../rng";
import type { ScoredSymbolMatchItem } from "../types";

const SYMBOLS = ["●", "■", "▲", "◆", "★", "▶", "◼", "✚", "◉", "☗"];

/** Rapid same/different symbol-pair trials, as in classic processing-speed / symbol-search tasks. */
export function generateSpeedItem(rand: () => number, index: number, id: string): ScoredSymbolMatchItem {
  const setSize = 3;
  const left = shuffle(rand, SYMBOLS).slice(0, setSize);
  const same = rand() < 0.5;

  let right: string[];
  if (same) {
    right = [...left];
  } else {
    right = [...left];
    const swapIdx = randInt(rand, 0, setSize - 1);
    const remaining = SYMBOLS.filter((s) => !left.includes(s));
    right[swapIdx] = remaining[randInt(rand, 0, remaining.length - 1)];
  }

  return {
    kind: "symbolMatch",
    id,
    domain: "speed",
    left,
    right,
    same,
    difficulty: 0,
  };
}
