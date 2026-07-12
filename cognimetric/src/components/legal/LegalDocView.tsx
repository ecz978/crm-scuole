import type { LegalDoc } from "@/content/legal/types";

export function LegalDocView({ title, doc }: { title: string; doc: LegalDoc }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{doc.updated}</p>
      <div className="mt-8 space-y-8">
        {doc.sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{s.heading}</h2>
            {s.body.split("\n\n").map((p, j) => (
              <p key={j} className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
