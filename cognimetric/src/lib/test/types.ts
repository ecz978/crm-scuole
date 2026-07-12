export type Domain = "logical" | "numerical" | "verbal" | "spatial" | "memory" | "speed";

export const DOMAINS: Domain[] = ["logical", "numerical", "verbal", "spatial", "memory", "speed"];

export interface DomainConfig {
  domain: Domain;
  itemCount: number;
  timeLimitSeconds: number;
}

export const DOMAIN_CONFIG: Record<Domain, DomainConfig> = {
  logical: { domain: "logical", itemCount: 8, timeLimitSeconds: 300 },
  numerical: { domain: "numerical", itemCount: 8, timeLimitSeconds: 240 },
  verbal: { domain: "verbal", itemCount: 8, timeLimitSeconds: 240 },
  spatial: { domain: "spatial", itemCount: 8, timeLimitSeconds: 300 },
  memory: { domain: "memory", itemCount: 6, timeLimitSeconds: 240 },
  speed: { domain: "speed", itemCount: 40, timeLimitSeconds: 90 },
};

export interface ShapeSpec {
  kind: "shape";
  shape: "circle" | "square" | "triangle" | "star" | "hexagon" | "diamond" | "pentagon";
  count: number;
  fill: "solid" | "outline" | "striped";
  rotation: number;
  color: string;
}

export interface PolyshapeSpec {
  kind: "polyshape";
  pathId: string;
  rotation: number;
  mirrored: boolean;
}

export type PromptPayload =
  | { kind: "sequence"; sequence: ShapeSpec[] }
  | { kind: "numberSequence"; sequence: (number | null)[] }
  | { kind: "text"; text: string }
  | { kind: "target"; target: PolyshapeSpec };

export type OptionPayload = ShapeSpec | PolyshapeSpec | { kind: "number"; value: number } | { kind: "text"; text: string };

/** Multiple-choice item (logical, numerical, verbal, spatial). */
export interface ChoiceItem {
  kind: "choice";
  id: string;
  domain: Domain;
  prompt: PromptPayload;
  options: OptionPayload[];
}
export interface ScoredChoiceItem extends ChoiceItem {
  correctIndex: number;
  difficulty: number;
}

/**
 * Sequence-recall item (working memory / digit span). Unlike choice items, the
 * "sequence" here is the stimulus itself, not a hidden answer — the client needs
 * it to display the sequence to the test-taker, so it's part of the base type.
 */
export interface DigitSpanItem {
  kind: "digitSpan";
  id: string;
  domain: "memory";
  length: number;
  sequence: number[];
}
export interface ScoredDigitSpanItem extends DigitSpanItem {
  difficulty: number;
}

/** Same/different symbol-matching item (processing speed). */
export interface SymbolMatchItem {
  kind: "symbolMatch";
  id: string;
  domain: "speed";
  left: string[];
  right: string[];
}
export interface ScoredSymbolMatchItem extends SymbolMatchItem {
  same: boolean;
  difficulty: number;
}

export type TestItem = ChoiceItem | DigitSpanItem | SymbolMatchItem;
export type ScoredTestItem = ScoredChoiceItem | ScoredDigitSpanItem | ScoredSymbolMatchItem;

export function stripAnswer(item: ScoredTestItem): TestItem {
  if (item.kind === "choice") {
    const { id, domain, prompt, options, kind } = item;
    return { kind, id, domain, prompt, options };
  }
  if (item.kind === "digitSpan") {
    const { id, domain, length, sequence, kind } = item;
    return { kind, id, domain, length, sequence };
  }
  const { id, domain, left, right, kind } = item;
  return { kind, id, domain, left, right };
}
