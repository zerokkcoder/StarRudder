import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  if (!article) return createMetadata({ title: "资讯未找到", path: `/news/${slug}` });

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
    <article className="container max-w-3xl py-16 sm:py-20">
      <JsonLd schema={articleJsonLd} />
      <Button render={<Link href="/news" />} variant="ghost" size="sm" className="-ml-2">
        <ArrowLeft />
        返回资讯
      </Button>

      <header className="mt-8 border-b pb-8">
        <div className="flex flex-wrap items-center gap-2">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-normal">
              {tag}
            </Badge>
          ))}
          {article.source === "rss" && (
            <Badge variant="outline" className="font-normal">聚合内容</Badge>
          )}
        </div>
        <h1 className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
          {article.title}
        </h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">{article.summary}</p>
        <time dateTime={article.publishedAt.toISOString()} className="mt-5 block text-xs text-muted-foreground">
          {dateFormatter.format(article.publishedAt)}
          {article.sourceUrl && ` · 原文：${new URL(article.sourceUrl).hostname}`}
        </time>
      </header>

      <div className="mt-10 space-y-5 text-[15px] leading-8 text-foreground/90">
        {article.content.split(/\n\n+/).map((paragraph, index) => (
          <p key={index} className="whitespace-pre-line">
            {paragraph}
          </p>
        ))}
      </div>

      {article.sourceUrl && (
        <div className="mt-12 rounded-xl border bg-card p-5">
          <p className="text-xs text-muted-foreground">
            本文为聚合摘要，版权归原作者所有。点击下方按钮阅读原文。
          </p>
          <Button
            render={<a href={article.sourceUrl} target="_blank" rel="noopener noreferrer" />}
            variant="outline"
            size="sm"
            className="mt-3"
          >
            阅读原文
            <ExternalLink />
          </Button>
        </div>
      )}
    </article>
  );
}
