import { domainRandom } from "./rng";
import { DOMAIN_CONFIG, type Domain, type ScoredTestItem } from "./types";
import type { Locale } from "../i18n/config";
import { generateLogicalItem } from "./generators/logical";
import { generateNumericalItem } from "./generators/numerical";
import { generateSpatialItem } from "./generators/spatial";
import { generateMemoryItem } from "./generators/memory";
import { generateSpeedItem } from "./generators/speed";
import { generateVerbalItems } from "./generators/verbal";

/**
 * Regenerates the full, answer-bearing item set for an attempt from its seed alone.
 * Because every generator is a pure function of a domain-scoped seeded RNG, the server
 * never needs to persist item content — it can recompute it at submission time to
 * grade responses, which also means the answer key never has to leave the server.
 */
export function buildAttemptItems(seed: string, locale: Locale): Record<Domain, ScoredTestItem[]> {
  const logicalRand = domainRandom(seed, "logical");
  const numericalRand = domainRandom(seed, "numerical");
  const spatialRand = domainRandom(seed, "spatial");
  const memoryRand = domainRandom(seed, "memory");
  const speedRand = domainRandom(seed, "speed");
  const verbalRand = domainRandom(seed, "verbal");

  const logical = Array.from({ length: DOMAIN_CONFIG.logical.itemCount }, (_, i) =>
    generateLogicalItem(logicalRand, i, `logical-${i}`)
  );
  const numerical = Array.from({ length: DOMAIN_CONFIG.numerical.itemCount }, (_, i) =>
    generateNumericalItem(numericalRand, i, `numerical-${i}`)
  );
  const spatial = Array.from({ length: DOMAIN_CONFIG.spatial.itemCount }, (_, i) =>
    generateSpatialItem(spatialRand, i, `spatial-${i}`)
  );
  const memory = Array.from({ length: DOMAIN_CONFIG.memory.itemCount }, (_, i) =>
    generateMemoryItem(memoryRand, i, `memory-${i}`)
  );
  const speed = Array.from({ length: DOMAIN_CONFIG.speed.itemCount }, (_, i) =>
    generateSpeedItem(speedRand, i, `speed-${i}`)
  );
  const verbal = generateVerbalItems(verbalRand, locale, DOMAIN_CONFIG.verbal.itemCount);

  return { logical, numerical, spatial, memory, speed, verbal };
}
