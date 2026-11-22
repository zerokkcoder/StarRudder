import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllArticles } from "@/lib/queries";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "航海日志",
  description: "星舵航海日志：科技趋势、AI 动态与精选好文，原创与聚合内容并存。",
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
    <div className="container py-14 sm:py-20">
      <header>
        <div className="flex items-center gap-3">
          <span className="index-num text-primary">03 / JOURNAL</span>
          <span className="index-num uppercase tracking-[0.2em]">Field notes</span>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">航海日志</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
          值得花时间读的内容。原创为全文，聚合内容仅保留摘要并标注来源。
        </p>
      </header>

      <ul className="mt-12 border-t" style={{ borderColor: "var(--border)" }}>
        {articles.map((article, index) => (
          <li key={article.id} className="group border-b" style={{ borderColor: "var(--border)" }}>
            <Link href={`/news/${article.slug}`} className="flex items-start gap-5 py-6 transition-colors hover:bg-accent/40 sm:gap-10">
              <span className="index-num w-6 shrink-0 group-hover:text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <time dateTime={article.publishedAt.toISOString()} className="index-num hidden w-28 shrink-0 sm:block">
                {dateFormatter.format(article.publishedAt)}
              </time>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-medium transition-colors group-hover:text-primary sm:text-lg">
                    {article.title}
                  </span>
                  {article.source === "rss" && (
                    <span className="index-num border px-1.5 py-0.5" style={{ borderColor: "var(--border)" }}>RSS</span>
                  )}
                </span>
                <span className="mt-2 block text-xs leading-6 text-muted-foreground sm:text-sm">
                  {article.summary}
                </span>
                <span className="index-num mt-3 block sm:hidden">
                  {dateFormatter.format(article.publishedAt)}
                </span>
              </span>
              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
