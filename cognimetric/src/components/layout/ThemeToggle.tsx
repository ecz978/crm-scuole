"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionary-type";

export function ThemeToggle({ dict }: { dict: Dictionary["common"] }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-9 w-28" />;

  const options: { value: string; label: string; icon: typeof Sun }[] = [
    { value: "light", label: dict.themeLight, icon: Sun },
    { value: "dark", label: dict.themeDark, icon: Moon },
    { value: "system", label: dict.themeSystem, icon: Monitor },
  ];

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-900">
      {options.map((opt) => {
        const Icon = opt.icon;
        const active = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            aria-label={opt.label}
            title={opt.label}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              active
                ? "bg-white text-brand-600 shadow-sm dark:bg-slate-700 dark:text-brand-300"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"
            }`}
          >
            <Icon size={15} />
          </button>
        );
      })}
    </div>
  );
}
