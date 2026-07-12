import type { Domain } from "./types";

export interface GradedResponse {
  domain: Domain;
  correct: boolean;
  difficulty: number;
  responseMs: number;
}

/**
 * One-parameter logistic (Rasch-style) ability estimate.
 * P(correct | theta, b) = 1 / (1 + exp(-(theta - b)))
 * Estimated via a handful of Newton-Raphson steps from theta = 0.
 */
export function estimateTheta(responses: { correct: boolean; difficulty: number }[]): number {
  if (responses.length === 0) return 0;

  let theta = 0;
  for (let iter = 0; iter < 25; iter++) {
    let score = 0;
    let info = 0;
    for (const r of responses) {
      const p = 1 / (1 + Math.exp(-(theta - r.difficulty)));
      score += (r.correct ? 1 : 0) - p;
      info += p * (1 - p);
    }
    if (info < 1e-6) break;
    const step = score / info;
    theta += step;
    if (Math.abs(step) < 1e-4) break;
  }
  return clamp(theta, -4, 4);
}

/** Standard normal CDF via the Abramowitz-Stegun approximation of erf. */
export function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) p = 1 - p;
  return 1 - p;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function thetaToStandardScore(theta: number): number {
  return Math.round(clamp(100 + 15 * theta, 40, 160));
}

// Speed domain uses raw throughput rather than a difficulty-weighted ability estimate,
// since every trial has (by design) roughly equal, low difficulty and the construct being
// measured is speed/accuracy under time pressure, not item difficulty.
// These reference parameters are self-defined (not derived from a clinical norming sample) —
// see the Methodology page for the full disclosure.
const SPEED_REFERENCE_MEAN = 30;
const SPEED_REFERENCE_SD = 7;

export function speedThrottleTheta(correctCount: number, incorrectCount: number): number {
  const net = correctCount - incorrectCount;
  const z = (net - SPEED_REFERENCE_MEAN) / SPEED_REFERENCE_SD;
  return clamp(z, -4, 4);
}

export interface DomainResult {
  domain: Domain;
  theta: number;
  standardScore: number;
  itemCount: number;
  correctCount: number;
}

export interface ScoringResult {
  domainResults: DomainResult[];
  domainScores: Record<string, number>;
  compositeTheta: number;
  compositeScore: number;
  percentile: number;
  reliabilityFlag: "ok" | "fast_responding" | "insufficient_data";
}

export function scoreAttempt(responses: GradedResponse[]): ScoringResult {
  const byDomain = new Map<Domain, GradedResponse[]>();
  for (const r of responses) {
    if (!byDomain.has(r.domain)) byDomain.set(r.domain, []);
    byDomain.get(r.domain)!.push(r);
  }

  const domainResults: DomainResult[] = [];
  for (const [domain, items] of byDomain.entries()) {
    let theta: number;
    if (domain === "speed") {
      const correctCount = items.filter((i) => i.correct).length;
      const incorrectCount = items.length - correctCount;
      theta = speedThrottleTheta(correctCount, incorrectCount);
    } else {
      theta = estimateTheta(items);
    }
    domainResults.push({
      domain,
      theta,
      standardScore: thetaToStandardScore(theta),
      itemCount: items.length,
      correctCount: items.filter((i) => i.correct).length,
    });
  }

  const compositeTheta = domainResults.length
    ? domainResults.reduce((sum, d) => sum + d.theta, 0) / domainResults.length
    : 0;
  const compositeScore = thetaToStandardScore(compositeTheta);
  const percentile = Math.round(normalCdf(compositeTheta) * 1000) / 10;

  const choiceResponses = responses.filter((r) => r.domain !== "speed");
  const fastCount = choiceResponses.filter((r) => r.responseMs < 900).length;
  const reliabilityFlag: ScoringResult["reliabilityFlag"] =
    responses.length < 20
      ? "insufficient_data"
      : fastCount / Math.max(1, choiceResponses.length) > 0.3
      ? "fast_responding"
      : "ok";

  const domainScores: Record<string, number> = {};
  for (const d of domainResults) domainScores[d.domain] = d.standardScore;

  return { domainResults, domainScores, compositeTheta, compositeScore, percentile, reliabilityFlag };
}
