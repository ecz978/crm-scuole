import type { ShapeSpec } from "@/lib/test/types";

function polygonPoints(sides: number, radius: number, cx: number, cy: number, rotationDeg = -90) {
  const points: string[] = [];
  for (let i = 0; i < sides; i++) {
    const angle = (rotationDeg + (360 / sides) * i) * (Math.PI / 180);
    points.push(`${cx + radius * Math.cos(angle)},${cy + radius * Math.sin(angle)}`);
  }
  return points.join(" ");
}

function starPoints(cx: number, cy: number, outerR: number, innerR: number) {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (-90 + i * 36) * (Math.PI / 180);
    points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return points.join(" ");
}

function ShapeOutline({ shape, patternId }: { shape: ShapeSpec["shape"]; patternId: string }) {
  const commonProps = { className: "fill-[url(#pat)] stroke-current" } as const;
  const fillAttr = `url(#${patternId})`;

  switch (shape) {
    case "circle":
      return <circle cx={32} cy={32} r={22} fill={fillAttr} stroke="currentColor" strokeWidth={3} />;
    case "square":
      return <polygon points={polygonPoints(4, 22, 32, 32, -45)} fill={fillAttr} stroke="currentColor" strokeWidth={3} />;
    case "diamond":
      return <polygon points={polygonPoints(4, 22, 32, 32, 0)} fill={fillAttr} stroke="currentColor" strokeWidth={3} />;
    case "triangle":
      return <polygon points={polygonPoints(3, 22, 32, 33)} fill={fillAttr} stroke="currentColor" strokeWidth={3} />;
    case "pentagon":
      return <polygon points={polygonPoints(5, 22, 32, 32)} fill={fillAttr} stroke="currentColor" strokeWidth={3} />;
    case "hexagon":
      return <polygon points={polygonPoints(6, 22, 32, 32)} fill={fillAttr} stroke="currentColor" strokeWidth={3} />;
    case "star":
      return <polygon points={starPoints(32, 32, 22, 9)} fill={fillAttr} stroke="currentColor" strokeWidth={3} />;
  }
}

/** Renders a single ShapeSpec (used by logical-reasoning items) as an inline SVG glyph. */
export function ShapeGlyph({ spec, size = 56 }: { spec: ShapeSpec; size?: number }) {
  const patternId = `stripe-${spec.shape}-${spec.rotation}-${spec.fill}`;
  const cells = Array.from({ length: spec.count });

  return (
    <div className="flex items-center justify-center gap-1" style={{ color: "var(--shape-color, #2c42e0)" }}>
      {cells.map((_, i) => (
        <svg
          key={i}
          width={size / Math.max(1, spec.count === 3 ? 1.6 : 1)}
          height={size / Math.max(1, spec.count === 3 ? 1.6 : 1)}
          viewBox="0 0 64 64"
          style={{ transform: `rotate(${spec.rotation}deg)` }}
        >
          <defs>
            <pattern id={patternId} width={6} height={6} patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <rect width={6} height={6} fill={spec.fill === "solid" ? "currentColor" : "transparent"} />
              {spec.fill === "striped" && <line x1={0} y1={0} x2={0} y2={6} stroke="currentColor" strokeWidth={3} />}
            </pattern>
          </defs>
          <ShapeOutline shape={spec.shape} patternId={patternId} />
        </svg>
      ))}
    </div>
  );
}
