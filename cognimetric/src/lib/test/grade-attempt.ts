import { buildAttemptItems } from "./build-attempt";
import { scoreAttempt, type GradedResponse, type ScoringResult } from "./scoring";
import type { Domain, ScoredTestItem } from "./types";
import type { Locale } from "../i18n/config";

export interface AnswerInput {
  itemId: string;
  domain: Domain;
  responseMs: number;
  choiceIndex?: number;
  sequence?: number[];
  boolAnswer?: boolean;
}

export interface GradedAnswer {
  itemId: string;
  domain: Domain;
  correct: boolean;
  difficulty: number;
  responseMs: number;
}

function sequencesEqual(a: number[] | undefined, b: number[]): boolean {
  if (!a || a.length !== b.length) return false;
  return a.every((v, i) => v === b[i]);
}

function isCorrect(item: ScoredTestItem, answer: AnswerInput): boolean {
  if (item.kind === "choice") return answer.choiceIndex === item.correctIndex;
  if (item.kind === "digitSpan") return sequencesEqual(answer.sequence, item.sequence);
  return answer.boolAnswer === item.same;
}

export function gradeAttempt(
  seed: string,
  locale: Locale,
  answers: AnswerInput[]
): { graded: GradedAnswer[]; scoring: ScoringResult } {
  const itemsByDomain = buildAttemptItems(seed, locale);
  const itemById = new Map<string, ScoredTestItem>();
  for (const items of Object.values(itemsByDomain)) {
    for (const item of items) itemById.set(item.id, item);
  }

  const graded: GradedAnswer[] = [];
  for (const answer of answers) {
    const item = itemById.get(answer.itemId);
    if (!item) continue;
    graded.push({
      itemId: item.id,
      domain: item.domain,
      correct: isCorrect(item, answer),
      difficulty: item.difficulty,
      responseMs: answer.responseMs,
    });
  }

  const responses: GradedResponse[] = graded.map((g) => ({
    domain: g.domain,
    correct: g.correct,
    difficulty: g.difficulty,
    responseMs: g.responseMs,
  }));

  return { graded, scoring: scoreAttempt(responses) };
}
