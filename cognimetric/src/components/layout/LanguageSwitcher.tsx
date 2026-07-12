"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, localeNames, type Locale } from "@/lib/i18n/config";
import { Globe } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  function switchTo(locale: Locale) {
    const rest = pathname.split("/").slice(2).join("/");
    document.cookie = `cm_locale=${locale};max-age=${60 * 60 * 24 * 365};path=/`;
    router.push(`/${locale}${rest ? `/${rest}` : ""}`);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-600 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
      >
        <Globe size={14} />
        {current.toUpperCase()}
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-30 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => switchTo(l)}
              className={`block w-full px-3 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-800 ${
                l === current ? "font-semibold text-brand-600 dark:text-brand-300" : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {localeNames[l]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
