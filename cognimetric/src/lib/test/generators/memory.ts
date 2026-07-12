import { randInt } from "../rng";
import type { ScoredDigitSpanItem } from "../types";

/** Digit-span trials: length increases each trial (4 → 9), mirroring standard working-memory batteries. */
export function generateMemoryItem(rand: () => number, index: number, id: string): ScoredDigitSpanItem {
  const length = 4 + index; // 4,5,6,7,8,9 across the 6 trials
  const sequence: number[] = [];
  let last = -1;
  for (let i = 0; i < length; i++) {
    let d = randInt(rand, 0, 9);
    while (d === last) d = randInt(rand, 0, 9);
    sequence.push(d);
    last = d;
  }
  const difficulty = -1.5 + (length - 4) * 0.5;

  return {
    kind: "digitSpan",
    id,
    domain: "memory",
    length,
    sequence,
    difficulty,
  };
}
