import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getAllArticles, getArticleBySlug } from "@/lib/queries";
import { createMetadata, JsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return createMetadata({ title: "条目未找到", path: `/news/${slug}` });
  return createMetadata({
    title: article.title,
    description: article.summary,
    path: `/news/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt.toISOString(),
  });
}

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt.toISOString(),
    inLanguage: "zh-CN",
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/news/${article.slug}`,
  };

  return (
    <article className="container max-w-3xl py-20 sm:py-28">
      <JsonLd schema={articleJsonLd} />
      <Link href="/news" className="flex items-center gap-2 index-num transition-colors hover:text-primary">
        <ArrowLeft className="size-3.5" /> 返回日志
      </Link>

      <header className="mt-12 border-b pb-10" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-3">
          <span className="index-num text-primary">03 / JOURNAL ENTRY</span>
          {article.source === "rss" && (
            <span className="index-num border px-1.5 py-0.5" style={{ borderColor: "var(--border)" }}>RSS 聚合</span>
          )}
        </div>
        <h1 className="mt-6 text-balance text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-5 text-sm leading-7 text-muted-foreground">{article.summary}</p>
        <div className="index-num mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <time dateTime={article.publishedAt.toISOString()}>{dateFormatter.format(article.publishedAt)}</time>
          {article.tags.map((tag) => <span key={tag}>#{tag}</span>)}
          {article.sourceUrl && <span>源：{new URL(article.sourceUrl).hostname}</span>}
        </div>
      </header>

      <div className="mt-10 space-y-6 text-[15px] leading-8 text-foreground/90">
        {article.content.split(/\n\n+/).map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line">{paragraph}</p>
        ))}
      </div>

      {article.sourceUrl && (
        <div className="mt-14 border-t pt-6" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs text-muted-foreground">本文为聚合摘要，版权归原作者所有。</p>
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 index-num transition-colors hover:text-primary"
          >
            阅读原文 <ExternalLink className="size-3.5" />
          </a>
        </div>
      )}
    </article>
  );
}
