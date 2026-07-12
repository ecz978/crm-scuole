import type { PolyshapeSpec } from "@/lib/test/types";

// Eight chiral tetromino/pentomino outlines (L, S, N, Y, F, P, W, Z) — each is
// genuinely asymmetric, so a mirrored copy cannot be produced by rotation alone.
// That property is what makes them usable as mental-rotation stimuli/distractors.
const SHAPES: Record<string, [number, number][]> = {
  p1: [[0, 0], [0, 1], [0, 2], [1, 2]], // L
  p2: [[1, 0], [2, 0], [0, 1], [1, 1]], // S
  p3: [[1, 0], [1, 1], [0, 1], [0, 2], [0, 3]], // N
  p4: [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]], // Y
  p5: [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], // F
  p6: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]], // P
  p7: [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2]], // W
  p8: [[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]], // Z
};

const CELL = 16;

function layout(cells: [number, number][]) {
  const cols = cells.map((c) => c[0]);
  const rows = cells.map((c) => c[1]);
  const minCol = Math.min(...cols);
  const maxCol = Math.max(...cols);
  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);
  const width = (maxCol - minCol + 1) * CELL;
  const height = (maxRow - minRow + 1) * CELL;
  const originX = 50 - width / 2 - minCol * CELL;
  const originY = 50 - height / 2 - minRow * CELL;
  return { originX, originY };
}

export function PolyShape({ spec, size = 72 }: { spec: PolyshapeSpec; size?: number }) {
  const cells = SHAPES[spec.pathId] ?? SHAPES.p1;
  const { originX, originY } = layout(cells);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        transform: `rotate(${spec.rotation}deg) scaleX(${spec.mirrored ? -1 : 1})`,
        transformOrigin: "50% 50%",
        color: "var(--shape-color, #2c42e0)",
      }}
    >
      {cells.map(([col, row], i) => (
        <rect
          key={i}
          x={originX + col * CELL}
          y={originY + row * CELL}
          width={CELL - 2}
          height={CELL - 2}
          rx={2}
          fill="currentColor"
        />
      ))}
    </svg>
  );
}
