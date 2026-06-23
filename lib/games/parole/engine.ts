import puzzlesData from "./puzzles.json";

export interface Puzzle {
  day: number;
  center: string;
  outer: string[];
  words: string[];
}

export interface Level {
  name: string;
  pct: number;
}

const puzzles = puzzlesData as Puzzle[];
const TOTAL_DAYS = puzzles.length;

export const LEVELS: Level[] = [
  { name: "Principiante", pct: 0 },
  { name: "Buon inizio", pct: 2 },
  { name: "In crescita", pct: 5 },
  { name: "Niente male", pct: 8 },
  { name: "Promettente", pct: 15 },
  { name: "Solido", pct: 25 },
  { name: "Ottimo", pct: 40 },
  { name: "Fantastico", pct: 50 },
  { name: "Genio", pct: 70 },
];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 1);
  const diff = Math.floor((date.getTime() - start.getTime()) / 86400000);
  return diff + 1;
}

export function dayIndexForDate(date: Date): number {
  const doy = dayOfYear(date);
  return ((doy - 1) % TOTAL_DAYS) + 1;
}

export function getPuzzleForDate(date: Date): Puzzle {
  const idx = dayIndexForDate(date);
  return puzzles[idx - 1];
}

export function getPreviousPuzzle(date: Date): { puzzle: Puzzle; date: Date } {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 1);
  return { puzzle: getPuzzleForDate(prev), date: prev };
}

export function puzzleLetters(puzzle: Puzzle): string[] {
  return [...puzzle.outer, puzzle.center];
}

export function scoreForWord(word: string): number {
  return word.length === 4 ? 1 : word.length;
}

export function maxScoreForPuzzle(puzzle: Puzzle): number {
  return puzzle.words.reduce((sum, w) => sum + scoreForWord(w), 0);
}

export function validateWord(
  word: string,
  puzzle: Puzzle,
  alreadyFound: Set<string>
): { ok: boolean; reason?: string; points?: number } {
  const w = word.trim().toLowerCase();
  if (w.length < 4) return { ok: false, reason: "Troppo corta: minimo 4 lettere" };
  if (!w.includes(puzzle.center)) return { ok: false, reason: "Manca la lettera centrale" };
  const allowed = new Set(puzzleLetters(puzzle));
  for (const ch of w) {
    if (!allowed.has(ch)) return { ok: false, reason: "Lettera non disponibile" };
  }
  if (alreadyFound.has(w)) return { ok: false, reason: "Parola già trovata" };
  if (!puzzle.words.includes(w)) return { ok: false, reason: "Non nell'elenco delle parole" };
  return { ok: true, points: scoreForWord(w) };
}

export function levelForScore(score: number, maxScore: number): { level: Level; index: number; isMax: boolean; nextLevel: Level | null; pointsToNext: number } {
  let current = LEVELS[0];
  let index = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    const threshold = Math.round((LEVELS[i].pct / 100) * maxScore);
    if (score >= threshold) {
      current = LEVELS[i];
      index = i;
    }
  }
  const isMax = index === LEVELS.length - 1;
  const nextLevel = isMax ? null : LEVELS[index + 1];
  const pointsToNext = nextLevel ? Math.max(0, Math.round((nextLevel.pct / 100) * maxScore) - score) : 0;
  return { level: current, index, isMax, nextLevel, pointsToNext };
}

export function levelThresholds(maxScore: number): { name: string; points: number }[] {
  return LEVELS.map(l => ({ name: l.name, points: Math.round((l.pct / 100) * maxScore) }));
}

export function formatDateIt(date: Date): string {
  return date.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
