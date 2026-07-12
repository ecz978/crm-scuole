import Link from "next/link";
import type { Dictionary } from "@/lib/i18n/dictionary-type";
import type { Locale } from "@/lib/i18n/config";

export function Footer({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <p className="max-w-3xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">{dict.footer.disclaimer}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-800 dark:text-slate-200">{dict.common.siteName}</span>
          <Link href={`/${locale}/privacy`} className="hover:text-slate-900 dark:hover:text-white">
            {dict.footer.privacy}
          </Link>
          <Link href={`/${locale}/cookie-policy`} className="hover:text-slate-900 dark:hover:text-white">
            {dict.footer.cookies}
          </Link>
          <Link href={`/${locale}/terms`} className="hover:text-slate-900 dark:hover:text-white">
            {dict.footer.terms}
          </Link>
          <Link href={`/${locale}/methodology`} className="hover:text-slate-900 dark:hover:text-white">
            {dict.nav.methodology}
          </Link>
          <Link href={`/${locale}/blog`} className="hover:text-slate-900 dark:hover:text-white">
            {dict.nav.blog}
          </Link>
          <a href="mailto:privacy@cognimetric.example" className="hover:text-slate-900 dark:hover:text-white">
            {dict.footer.contact}
          </a>
        </div>
        <p className="mt-6 text-xs text-slate-400 dark:text-slate-600">
          © {new Date().getFullYear()} {dict.common.siteName}. {dict.footer.rights}
        </p>
      </div>
    </footer>
  );
}
