import { randInt, shuffle } from "../rng";
import type { ScoredChoiceItem } from "../types";

type RuleType = "arithmetic" | "geometric" | "alternating" | "quadratic" | "fibonacci";

const RULES_BY_LEVEL: RuleType[][] = [
  ["arithmetic"],
  ["arithmetic", "alternating"],
  ["geometric", "alternating", "quadratic"],
  ["quadratic", "fibonacci", "geometric"],
];

function buildSequence(rand: () => number, rule: RuleType): { seq: number[]; difficulty: number } {
  const n = 6;
  const seq: number[] = [];

  if (rule === "arithmetic") {
    const start = randInt(rand, 1, 20);
    const step = randInt(rand, 2, 9) * (randInt(rand, 0, 1) ? 1 : -1);
    for (let i = 0; i < n; i++) seq.push(start + step * i);
    return { seq, difficulty: -1.2 };
  }

  if (rule === "geometric") {
    const start = randInt(rand, 1, 5);
    const ratio = randInt(rand, 2, 3);
    let v = start;
    for (let i = 0; i < n; i++) {
      seq.push(v);
      v *= ratio;
    }
    return { seq, difficulty: 0.3 };
  }

  if (rule === "alternating") {
    const startA = randInt(rand, 1, 15);
    const stepA = randInt(rand, 1, 6);
    const startB = randInt(rand, 1, 15);
    const stepB = randInt(rand, 1, 6) * -1;
    for (let i = 0; i < n; i++) {
      seq.push(i % 2 === 0 ? startA + stepA * Math.floor(i / 2) : startB + stepB * Math.floor(i / 2));
    }
    return { seq, difficulty: 0.1 };
  }

  if (rule === "quadratic") {
    const start = randInt(rand, 1, 10);
    const firstDiff = randInt(rand, 1, 4);
    const diffStep = randInt(rand, 1, 3);
    let v = start;
    let d = firstDiff;
    for (let i = 0; i < n; i++) {
      seq.push(v);
      v += d;
      d += diffStep;
    }
    return { seq, difficulty: 0.9 };
  }

  // fibonacci-like: each term = sum of previous two (+ optional constant)
  const a0 = randInt(rand, 1, 5);
  const a1 = randInt(rand, 1, 5);
  seq.push(a0, a1);
  for (let i = 2; i < n; i++) seq.push(seq[i - 1] + seq[i - 2]);
  return { seq, difficulty: 1.3 };
}

export function generateNumericalItem(rand: () => number, index: number, id: string): ScoredChoiceItem {
  const level = Math.min(RULES_BY_LEVEL.length - 1, Math.floor(index / 2));
  const rule = RULES_BY_LEVEL[level][randInt(rand, 0, RULES_BY_LEVEL[level].length - 1)];

  let built = buildSequence(rand, rule);
  // Regenerate if numbers get unreasonably large for a "difficulty by design" test.
  let guard = 0;
  while (Math.abs(built.seq[built.seq.length - 1]) > 5000 && guard < 10) {
    built = buildSequence(rand, rule);
    guard++;
  }

  const correct = built.seq[5];
  const shown = built.seq.slice(0, 5) as (number | null)[];
  shown.push(null);

  const spread = Math.max(2, Math.round(Math.abs(correct) * 0.15) + 2);
  const distractorSet = new Set<number>();
  let attempts = 0;
  while (distractorSet.size < 4 && attempts < 50) {
    attempts++;
    const delta = randInt(rand, -spread, spread) || randInt(rand, 1, spread);
    const candidate = correct + delta;
    if (candidate !== correct) distractorSet.add(candidate);
  }
  const distractors = Array.from(distractorSet).slice(0, 4);

  const options = shuffle(rand, [correct, ...distractors]).map((value) => ({ kind: "number" as const, value }));
  const correctIndex = options.findIndex((o) => o.value === correct);

  const jitter = (rand() - 0.5) * 0.3;

  return {
    kind: "choice",
    id,
    domain: "numerical",
    prompt: { kind: "numberSequence", sequence: shown },
    options,
    correctIndex,
    difficulty: built.difficulty + jitter,
  };
}
