"use client";
import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import HexBoard from "@/components/games/HexBoard";
import {
  getPuzzleForDate,
  puzzleLetters,
  validateWord,
  scoreForWord,
  maxScoreForPuzzle,
  levelForScore,
  levelThresholds,
  formatDateIt,
} from "@/lib/games/parole/engine";
import { Delete, Shuffle, CornerDownLeft, Info, X, BookOpen, Trophy } from "lucide-react";

function todayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export default function ParoleGame() {
  const [now] = useState(() => new Date());
  const puzzle = useMemo(() => getPuzzleForDate(now), [now]);
  const letters = useMemo(() => puzzleLetters(puzzle), [puzzle]);
  const maxScore = useMemo(() => maxScoreForPuzzle(puzzle), [puzzle]);
  const storageKey = `parole-game-${todayKey(now)}-${puzzle.day}`;

  const [outer, setOuter] = useState(puzzle.outer);
  const [input, setInput] = useState("");
  const [found, setFound] = useState<string[]>([]);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        setFound(JSON.parse(raw));
      } catch {}
    }
    setLoaded(true);
  }, [storageKey]);

  useEffect(() => {
    if (loaded) localStorage.setItem(storageKey, JSON.stringify(found));
  }, [found, storageKey, loaded]);

  const score = useMemo(() => found.reduce((s, w) => s + scoreForWord(w), 0), [found]);
  const { level, isMax, nextLevel, pointsToNext } = useMemo(() => levelForScore(score, maxScore), [score, maxScore]);
  const thresholds = useMemo(() => levelThresholds(maxScore), [maxScore]);

  const flash = (text: string, ok: boolean) => {
    setMessage({ text, ok });
    window.clearTimeout((flash as any)._t);
    (flash as any)._t = window.setTimeout(() => setMessage(null), 1600);
  };

  const submit = useCallback(() => {
    if (isMax) return;
    const result = validateWord(input, puzzle, new Set(found));
    if (result.ok && result.points) {
      setFound(f => [...f, input.trim().toLowerCase()]);
      flash(`+${result.points} punti`, true);
    } else {
      flash(result.reason || "Parola non valida", false);
    }
    setInput("");
  }, [input, puzzle, found, isMax]);

  useEffect(() => {
    const allowed = new Set(letters);
    const handler = (e: KeyboardEvent) => {
      if (showRules || showScore) return;
      if (e.key === "Enter") {
        submit();
      } else if (e.key === "Backspace") {
        setInput(s => s.slice(0, -1));
      } else if (/^[a-zA-Z]$/.test(e.key) && allowed.has(e.key.toLowerCase())) {
        setInput(s => s + e.key.toLowerCase());
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [letters, submit, showRules, showScore]);

  const shuffle = () => {
    setOuter(o => {
      const copy = [...o];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
  };

  return (
    <div className="app-shell">
      <div className="app-header">
        <div className="app-logo">
          Parole<span>.</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Link href="/soluzioni" className="btn btn-secondary btn-sm">
            <BookOpen size={14} /> Soluzioni
          </Link>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowRules(true)}>
            <Info size={14} /> Regole
          </button>
        </div>
      </div>

      <div className="page" style={{ maxWidth: 640 }}>
        <div style={{ textAlign: "center", fontSize: 12, color: "var(--text-muted)", marginBottom: 16, textTransform: "capitalize" }}>
          {formatDateIt(now)} · Gioco n. {puzzle.day}
        </div>

        <button
          onClick={() => setShowScore(true)}
          className="surface"
          style={{
            width: "100%",
            padding: "12px 16px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            border: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Trophy size={16} color="var(--accent)" />
            <span style={{ fontWeight: 600, fontSize: 14 }}>{level.name}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            {isMax ? `Punteggio: ${score}` : `${score} pt · ${pointsToNext} al livello "${nextLevel?.name}"`}
          </div>
        </button>

        {isMax && (
          <div
            className="surface"
            style={{
              padding: 16,
              marginBottom: 20,
              background: "var(--success-light)",
              borderColor: "var(--success)",
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: 600, color: "var(--success)", marginBottom: 4 }}>
              🎉 Livello massimo raggiunto! Partita conclusa.
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {found.length} parole trovate · {score} punti. Torna domani per un nuovo gioco.
            </div>
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            fontSize: 28,
            fontFamily: "var(--font-mono)",
            fontWeight: 600,
            letterSpacing: 2,
            minHeight: 40,
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          {input.split("").map((ch, i) => (
            <span key={i} style={{ color: ch === puzzle.center ? "var(--accent)" : "var(--text)" }}>
              {ch}
            </span>
          ))}
          <span style={{ opacity: 0.3 }}>|</span>
        </div>

        {message && (
          <div
            style={{
              textAlign: "center",
              fontSize: 13,
              fontWeight: 500,
              color: message.ok ? "var(--success)" : "var(--danger)",
              marginBottom: 8,
            }}
          >
            {message.text}
          </div>
        )}

        <HexBoard center={puzzle.center} outer={outer} onLetter={l => !isMax && setInput(s => s + l)} />

        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 24, marginBottom: 28 }}>
          <button className="btn btn-secondary" onClick={() => setInput(s => s.slice(0, -1))} disabled={isMax}>
            <Delete size={15} /> Cancella
          </button>
          <button className="btn btn-secondary" onClick={shuffle}>
            <Shuffle size={15} /> Mescola
          </button>
          <button className="btn btn-primary" onClick={submit} disabled={isMax}>
            <CornerDownLeft size={15} /> Invio
          </button>
        </div>

        <div className="section-card">
          <div className="section-header">
            Parole trovate ({found.length})
          </div>
          <div className="section-body" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {found.length === 0 ? (
              <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Nessuna parola trovata, inizia a giocare!</div>
            ) : (
              [...found]
                .sort((a, b) => a.localeCompare(b))
                .map(w => (
                  <span key={w} className="badge badge-gray" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                    {w} <strong style={{ marginLeft: 4 }}>{scoreForWord(w)}</strong>
                  </span>
                ))
            )}
          </div>
        </div>
      </div>

      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
      {showScore && <ScoreModal thresholds={thresholds} score={score} maxScore={maxScore} onClose={() => setShowScore(false)} />}
    </div>
  );
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        className="surface"
        style={{ width: 420, maxWidth: "90vw", maxHeight: "80vh", overflowY: "auto", padding: 0 }}
        onClick={e => e.stopPropagation()}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 14 }}>{title}</div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>
        <div style={{ padding: 18 }}>{children}</div>
      </div>
    </div>
  );
}

function RulesModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell title="Regole" onClose={onClose}>
      <p style={{ marginBottom: 10, fontSize: 13, lineHeight: 1.6 }}>
        Crea quante più parole possibili con le lettere a disposizione. Le parole devono essere di almeno quattro
        lettere e contenere sempre la lettera centrale. La stessa lettera può essere usata più volte per comporre una
        parola.
      </p>
      <p style={{ marginBottom: 10, fontSize: 13, lineHeight: 1.6 }}>
        Più lunga è la parola, più punti ottieni. Clicca su Punteggio per vedere quanti punti servono per passare di
        livello. La partita finisce quando si raggiunge il livello massimo.
      </p>
      <p style={{ fontSize: 13, lineHeight: 1.6 }}>
        L&apos;elenco delle parole possibili è disponibile il giorno successivo, cliccando su Soluzioni nel menù.
      </p>
    </ModalShell>
  );
}

function ScoreModal({
  thresholds,
  score,
  maxScore,
  onClose,
}: {
  thresholds: { name: string; points: number }[];
  score: number;
  maxScore: number;
  onClose: () => void;
}) {
  return (
    <ModalShell title="Punteggio" onClose={onClose}>
      <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>
        Il tuo punteggio: <strong style={{ color: "var(--text)" }}>{score}</strong>
      </div>
      <table>
        <thead>
          <tr>
            <th>Livello</th>
            <th>Punti necessari</th>
          </tr>
        </thead>
        <tbody>
          {thresholds.map(t => (
            <tr key={t.name} style={score >= t.points ? { background: "var(--accent-light)" } : undefined}>
              <td>{t.name}</td>
              <td>{t.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </ModalShell>
  );
}
