"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { getPuzzleForDate, puzzleLetters, scoreForWord, formatDateIt } from "@/lib/games/parole/engine";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function SoluzioniPage() {
  const today = useMemo(() => startOfDay(new Date()), []);
  const yesterday = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - 1);
    return d;
  }, [today]);

  const [selected, setSelected] = useState(yesterday);
  const puzzle = useMemo(() => getPuzzleForDate(selected), [selected]);

  const canGoNext = selected.getTime() < yesterday.getTime();

  const goPrev = () => setSelected(d => {
    const nd = new Date(d);
    nd.setDate(nd.getDate() - 1);
    return nd;
  });
  const goNext = () => {
    if (!canGoNext) return;
    setSelected(d => {
      const nd = new Date(d);
      nd.setDate(nd.getDate() + 1);
      return nd;
    });
  };

  return (
    <div className="app-shell">
      <div className="app-header">
        <Link href="/" className="btn btn-secondary btn-sm">
          <ArrowLeft size={14} /> Torna al gioco
        </Link>
        <div style={{ fontSize: 14, fontWeight: 600 }}>Soluzioni</div>
      </div>
      <div className="page" style={{ maxWidth: 680 }}>
        <div className="surface" style={{ padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button className="btn btn-secondary btn-sm" onClick={goPrev}>
            <ChevronLeft size={14} /> Giorno prima
          </button>
          <div style={{ fontSize: 13, fontWeight: 500, textTransform: "capitalize" }}>{formatDateIt(selected)}</div>
          <button className="btn btn-secondary btn-sm" onClick={goNext} disabled={!canGoNext}>
            Giorno dopo <ChevronRight size={14} />
          </button>
        </div>

        <div className="surface" style={{ padding: 16, marginBottom: 16, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
            Lettere (gioco n. {puzzle.day})
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 600 }}>
            {puzzleLetters(puzzle).map(l => (
              <span key={l} style={{ color: l === puzzle.center ? "var(--accent)" : "var(--text)", margin: "0 4px" }}>
                {l.toUpperCase()}
              </span>
            ))}
          </div>
        </div>

        <div className="section-card">
          <div className="section-header">Elenco parole possibili ({puzzle.words.length})</div>
          <div className="section-body" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {puzzle.words.map(w => (
              <span key={w} className="badge badge-gray" style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
                {w} <strong style={{ marginLeft: 4 }}>{scoreForWord(w)}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
