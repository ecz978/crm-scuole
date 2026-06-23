"use client";

interface HexBoardProps {
  center: string;
  outer: string[];
  onLetter: (letter: string) => void;
}

const HEX_SIZE = 72;
const RADIUS = 82;

export default function HexBoard({ center, outer, onLetter }: HexBoardProps) {
  return (
    <div
      style={{
        position: "relative",
        width: RADIUS * 2 + HEX_SIZE,
        height: RADIUS * 2 + HEX_SIZE,
        margin: "0 auto",
      }}
    >
      <Hex letter={center} variant="center" onClick={() => onLetter(center)} x={0} y={0} />
      {outer.map((letter, i) => {
        const angle = (Math.PI / 180) * (i * 60 - 90);
        const x = RADIUS * Math.cos(angle);
        const y = RADIUS * Math.sin(angle);
        return <Hex key={letter + i} letter={letter} variant="outer" onClick={() => onLetter(letter)} x={x} y={y} />;
      })}
    </div>
  );
}

function Hex({
  letter,
  variant,
  onClick,
  x,
  y,
}: {
  letter: string;
  variant: "center" | "outer";
  onClick: () => void;
  x: number;
  y: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
        width: HEX_SIZE,
        height: HEX_SIZE * 0.95,
      }}
    >
      <button
        onClick={onClick}
        className="hex-btn"
        style={{
          width: "100%",
          height: "100%",
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          background: variant === "center" ? "var(--accent)" : "var(--surface)",
          color: variant === "center" ? "#fff" : "var(--text)",
          border: variant === "center" ? "none" : "1px solid var(--border-strong)",
          fontFamily: "var(--font-mono)",
          fontSize: 24,
          fontWeight: 600,
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "transform 0.1s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        {letter}
      </button>
    </div>
  );
}
