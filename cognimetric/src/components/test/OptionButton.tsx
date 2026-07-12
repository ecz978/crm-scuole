import type { OptionPayload } from "@/lib/test/types";
import { ShapeGlyph } from "./ShapeGlyph";
import { PolyShape } from "./PolyShape";

export function OptionContent({ option }: { option: OptionPayload }) {
  if (option.kind === "shape") return <ShapeGlyph spec={option} />;
  if (option.kind === "polyshape") return <PolyShape spec={option} />;
  if (option.kind === "number") return <span className="text-2xl font-semibold">{option.value}</span>;
  return <span className="text-base">{option.text}</span>;
}

export function OptionButton({
  option,
  selected,
  onClick,
  label,
}: {
  option: OptionPayload;
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-[92px] flex-col items-center justify-center gap-1 rounded-xl border-2 p-4 transition-colors ${
        selected
          ? "border-brand-500 bg-brand-50 dark:bg-brand-950/50"
          : "border-slate-200 bg-white hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
      }`}
    >
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <OptionContent option={option} />
    </button>
  );
}
