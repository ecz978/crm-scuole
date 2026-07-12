import { randInt, shuffle } from "../rng";
import type { PolyshapeSpec, ScoredChoiceItem } from "../types";

// Ids of hand-authored asymmetric polygon paths (see src/components/test/PolyShape.tsx for the actual SVG data).
// Asymmetry under rotation/mirroring is what makes these usable as mental-rotation stimuli.
export const POLYSHAPE_IDS = ["p1", "p2", "p3", "p4", "p5", "p6", "p7", "p8"];

const EASY_ROTATIONS = [90, 180, 270];
const HARD_ROTATIONS = [45, 135, 225, 315];

function specEquals(a: PolyshapeSpec, b: PolyshapeSpec) {
  return a.pathId === b.pathId && a.rotation === b.rotation && a.mirrored === b.mirrored;
}

export function generateSpatialItem(rand: () => number, index: number, id: string): ScoredChoiceItem {
  const tier = index < 3 ? 0 : index < 6 ? 1 : 2;
  const pathId = POLYSHAPE_IDS[randInt(rand, 0, POLYSHAPE_IDS.length - 1)];
  const rotationPool = tier === 0 ? EASY_ROTATIONS : HARD_ROTATIONS;
  const targetRotation = rotationPool[randInt(rand, 0, rotationPool.length - 1)];

  const target: PolyshapeSpec = { kind: "polyshape", pathId, rotation: 0, mirrored: false };
  const correct: PolyshapeSpec = { kind: "polyshape", pathId, rotation: targetRotation, mirrored: false };

  const distractors: PolyshapeSpec[] = [];
  const mirroredFoilCount = tier === 2 ? 2 : 1;
  const allRotations = [...EASY_ROTATIONS, ...HARD_ROTATIONS];

  // Mirror-image foils: same outline, wrong handedness — the classic mental-rotation distractor.
  const usedRotations = new Set<number>([targetRotation]);
  for (let i = 0; i < mirroredFoilCount; i++) {
    let rot = allRotations[randInt(rand, 0, allRotations.length - 1)];
    let guard = 0;
    while (usedRotations.has(rot) && guard < 20) {
      rot = allRotations[randInt(rand, 0, allRotations.length - 1)];
      guard++;
    }
    usedRotations.add(rot);
    distractors.push({ kind: "polyshape", pathId, rotation: rot, mirrored: true });
  }

  // Wrong-rotation, correctly-handed foils.
  while (distractors.length < 3) {
    let rot = allRotations[randInt(rand, 0, allRotations.length - 1)];
    let guard = 0;
    while ((usedRotations.has(rot)) && guard < 20) {
      rot = allRotations[randInt(rand, 0, allRotations.length - 1)];
      guard++;
    }
    usedRotations.add(rot);
    const candidate: PolyshapeSpec = { kind: "polyshape", pathId, rotation: rot, mirrored: false };
    if (!specEquals(candidate, correct)) distractors.push(candidate);
  }

  // A different-shape foil to prevent pure elimination-by-outline strategies.
  let otherPathId = POLYSHAPE_IDS[randInt(rand, 0, POLYSHAPE_IDS.length - 1)];
  let guard = 0;
  while (otherPathId === pathId && guard < 10) {
    otherPathId = POLYSHAPE_IDS[randInt(rand, 0, POLYSHAPE_IDS.length - 1)];
    guard++;
  }
  distractors.push({ kind: "polyshape", pathId: otherPathId, rotation: targetRotation, mirrored: false });

  const options = shuffle(rand, [correct, ...distractors.slice(0, 4)]);
  const correctIndex = options.findIndex((o) => specEquals(o as PolyshapeSpec, correct));

  const jitter = (rand() - 0.5) * 0.3;
  const difficulty = -1 + tier * 0.9 + jitter;

  return {
    kind: "choice",
    id,
    domain: "spatial",
    prompt: { kind: "target", target },
    options,
    correctIndex,
    difficulty,
  };
}
