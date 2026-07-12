import { randInt, shuffle } from "../rng";
import type { ScoredChoiceItem, ShapeSpec } from "../types";

const SHAPES: ShapeSpec["shape"][] = ["circle", "square", "triangle", "star", "hexagon", "diamond", "pentagon"];
const FILLS: ShapeSpec["fill"][] = ["solid", "outline", "striped"];

type Attribute = "shape" | "rotation" | "count" | "fill";
const ALL_ATTRS: Attribute[] = ["shape", "rotation", "count", "fill"];

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/** Generates the shape at a given sequence position given which attributes are "active" (changing) and their step. */
function shapeAt(
  pos: number,
  base: { shapeIdx: number; rotation: number; count: number; fillIdx: number },
  steps: Partial<Record<Attribute, number>>
): ShapeSpec {
  const shapeIdx = mod(base.shapeIdx + (steps.shape ?? 0) * pos, SHAPES.length);
  const rotation = mod(base.rotation + (steps.rotation ?? 0) * pos, 360);
  const count = mod(base.count - 1 + (steps.count ?? 0) * pos, 3) + 1;
  const fillIdx = mod(base.fillIdx + (steps.fill ?? 0) * pos, FILLS.length);
  return {
    kind: "shape",
    shape: SHAPES[shapeIdx],
    rotation,
    count,
    fill: FILLS[fillIdx],
    color: "currentColor",
  };
}

function shapeEquals(a: ShapeSpec, b: ShapeSpec) {
  return a.shape === b.shape && a.rotation === b.rotation && a.count === b.count && a.fill === b.fill;
}

export function generateLogicalItem(rand: () => number, index: number, id: string): ScoredChoiceItem {
  const activeCount = Math.min(3, 1 + Math.floor(index / 3));
  const active = shuffle(rand, ALL_ATTRS).slice(0, activeCount);

  const base = {
    shapeIdx: randInt(rand, 0, SHAPES.length - 1),
    rotation: randInt(rand, 0, 7) * 45,
    count: randInt(rand, 1, 3),
    fillIdx: randInt(rand, 0, FILLS.length - 1),
  };

  const steps: Partial<Record<Attribute, number>> = {};
  for (const attr of active) {
    if (attr === "rotation") steps.rotation = [45, -45, 90][randInt(rand, 0, 2)];
    else if (attr === "count") steps.count = [1, -1][randInt(rand, 0, 1)];
    else if (attr === "shape") steps.shape = [1, -1, 2][randInt(rand, 0, 2)];
    else if (attr === "fill") steps.fill = [1, -1][randInt(rand, 0, 1)];
  }

  const sequence = [0, 1, 2, 3, 4].map((pos) => shapeAt(pos, base, steps));
  const correct = shapeAt(5, base, steps);

  const distractors: ShapeSpec[] = [];
  let guard = 0;
  while (distractors.length < 4 && guard < 100) {
    guard++;
    const mutateAttr = pick(rand, active.length ? active : ALL_ATTRS);
    const mutatedSteps = { ...steps };
    if (mutateAttr === "rotation") mutatedSteps.rotation = mod((steps.rotation ?? 0) + [45, -45, 90, 180][randInt(rand, 0, 3)], 360) || 45;
    else if (mutateAttr === "count") mutatedSteps.count = (steps.count ?? 0) === 1 ? -1 : 1;
    else if (mutateAttr === "shape") mutatedSteps.shape = mod((steps.shape ?? 0) + randInt(rand, 1, 3), SHAPES.length) || 1;
    else if (mutateAttr === "fill") mutatedSteps.fill = (steps.fill ?? 0) === 1 ? -1 : 1;

    const candidate = shapeAt(5, base, mutatedSteps);
    if (!shapeEquals(candidate, correct) && !distractors.some((d) => shapeEquals(d, candidate))) {
      distractors.push(candidate);
    }
  }
  // Fallback in the rare case the loop couldn't find 4 unique distractors: perturb rotation directly.
  while (distractors.length < 4) {
    const candidate: ShapeSpec = { ...correct, rotation: mod(correct.rotation + 45 * (distractors.length + 1), 360) };
    if (!shapeEquals(candidate, correct) && !distractors.some((d) => shapeEquals(d, candidate))) distractors.push(candidate);
  }

  const options = shuffle(rand, [correct, ...distractors]);
  const correctIndex = options.findIndex((o) => shapeEquals(o, correct));

  const jitter = (rand() - 0.5) * 0.4;
  const difficulty = -1 + 0.7 * (activeCount - 1) + jitter;

  return {
    kind: "choice",
    id,
    domain: "logical",
    prompt: { kind: "sequence", sequence },
    options,
    correctIndex,
    difficulty,
  };
}

function pick<T>(rand: () => number, arr: T[]): T {
  return arr[randInt(rand, 0, arr.length - 1)];
}
