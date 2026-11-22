import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAllArticles } from "@/lib/queries";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "资讯",
  description: "星舵资讯：科技趋势、AI 动态与精选好文，人工精选与优质来源聚合。",
  path: "/news",
});

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default async function NewsPage() {
  const articles = await getAllArticles();

  return (
    <div className="container py-16 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">Journal</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">资讯</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          值得花时间读的内容：原创精选与优质来源聚合，聚合内容仅展示摘要并标注来源。
        </p>
      </header>

      <ul className="mt-12 divide-y border-t">
        {articles.map((article) => (
          <li key={article.id}>
            <Link href={`/news/${article.slug}`} className="group grid gap-2 py-6 sm:grid-cols-[7rem_1fr_auto] sm:gap-8">
              <time dateTime={article.publishedAt.toISOString()} className="text-xs tabular-nums text-muted-foreground">
                {dateFormatter.format(article.publishedAt)}
              </time>
              <div>
                <h2 className="text-lg font-medium transition-colors group-hover:text-primary">
                  {article.title}
                </h2>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {article.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-normal">
                      {tag}
                    </Badge>
                  ))}
                  {article.source === "rss" && (
                    <Badge variant="outline" className="font-normal">聚合</Badge>
                  )}
                </div>
              </div>
              <ArrowRight className="hidden size-4 self-center text-muted-foreground transition-transform group-hover:translate-x-1 sm:block" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
