import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getAllArticles } from "@/lib/queries";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "最新资讯",
  description: "星舵资讯：科技趋势、AI 动态与精选好文，原创与聚合内容并存。",
  path: "/news",
});

const shortDate = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default async function NewsPage() {
  const articles = await getAllArticles();

  return (
    <div className="container py-7 sm:py-9">
      <header className="border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-xl font-semibold tracking-tight">最新资讯</h1>
        <p className="mt-1 text-xs text-muted-foreground">原创为全文，聚合内容仅保留摘要并标注来源。</p>
      </header>

      <ul className="border-b" style={{ borderColor: "var(--border)" }}>
        {articles.map((article, index) => (
          <li key={article.id} className="group border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
            <Link href={`/news/${article.slug}`} className="flex items-center gap-3 py-2.5 transition-colors hover:bg-accent/40">
              <span className="index-num w-5 shrink-0 group-hover:text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <time dateTime={article.publishedAt.toISOString()} className="index-num w-24 shrink-0">
                {shortDate.format(article.publishedAt)}
              </time>
              <span className="min-w-0 flex-1 truncate text-[13px] transition-colors group-hover:text-primary">
                {article.title}
              </span>
              {article.source === "rss" && <span className="index-num shrink-0">聚合</span>}
              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
