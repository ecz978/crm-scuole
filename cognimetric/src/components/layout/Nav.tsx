import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { Locale } from "@/lib/i18n/config";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Brain } from "lucide-react";

export function Nav({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/methodology`, label: dict.nav.methodology },
    { href: `/${locale}/blog`, label: dict.nav.blog },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <Brain className="text-brand-500" size={22} />
          {dict.common.siteName}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-slate-900 dark:hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher current={locale} />
          <ThemeToggle dict={dict.common} />
          <Link
            href={`/${locale}/test`}
            className="hidden rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 sm:inline-block"
          >
            {dict.common.startTest}
          </Link>
        </div>
      </div>
    </header>
  );
}
