import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getBlogContent } from "@/content/blog/get-blog-content";
import { notFound } from "next/navigation";

export default async function BlogIndexPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const [dict, posts] = await Promise.all([getDictionary(locale), getBlogContent(locale)]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{dict.blog.title}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{dict.blog.subtitle}</p>

      <div className="mt-10 space-y-8">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${locale}/blog/${post.slug}`}
            className="block rounded-2xl border border-slate-200 p-6 transition-colors hover:border-brand-300 dark:border-slate-800 dark:hover:border-brand-700"
          >
            <p className="text-xs text-slate-400">
              {dict.blog.publishedOn} {new Date(post.publishedAt).toLocaleDateString(locale)}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{post.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{post.excerpt}</p>
            <span className="mt-3 inline-block text-sm font-medium text-brand-600 dark:text-brand-400">
              {dict.blog.readMore} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
