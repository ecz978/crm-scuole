/**
 * Deterministic PRNG (mulberry32) so a test attempt's items can be
 * regenerated server-side from its seed alone — no item content needs to
 * be persisted, only the seed and the chosen answers.
 */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hashes an arbitrary string seed (e.g. a cuid) into a 32-bit int for mulberry32. */
export function seedFromString(input: string): number {
  let h = 0xdeadbeef ^ input.length;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 2654435761);
    h = (h << 13) | (h >>> 19);
  }
  return (h ^ (h >>> 16)) >>> 0;
}

/** Derives an independent sub-RNG for a given domain, so domains don't interfere with each other's draws. */
export function domainRandom(seed: string, domain: string) {
  return mulberry32(seedFromString(`${seed}:${domain}`));
}

export function randInt(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

export function pick<T>(rand: () => number, arr: T[]): T {
  return arr[randInt(rand, 0, arr.length - 1)];
}

/** Fisher-Yates shuffle using a supplied deterministic RNG. */
export function shuffle<T>(rand: () => number, arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(rand, 0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
