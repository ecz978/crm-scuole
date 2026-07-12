import Link from "next/link";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getBlogContent } from "@/content/blog/get-blog-content";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default async function BlogPostPage({ params }: { params: { locale: string; slug: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale: Locale = params.locale;
  const [dict, posts] = await Promise.all([getDictionary(locale), getBlogContent(locale)]);
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      <Link href={`/${locale}/blog`} className="inline-flex items-center gap-1.5 text-sm text-brand-600 dark:text-brand-400">
        <ArrowLeft size={14} /> {dict.blog.backToBlog}
      </Link>
      <p className="mt-6 text-xs text-slate-400">
        {dict.blog.publishedOn} {new Date(post.publishedAt).toLocaleDateString(locale)}
      </p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{post.title}</h1>
      <div className="mt-6 space-y-4">
        {post.paragraphs.map((p, i) => (
          <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </article>
  );
}
