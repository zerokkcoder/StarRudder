import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PAGE_SIZE, pageCount, Pagination } from "@/components/pagination";
import { getAllArticles } from "@/lib/queries";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { page } = await searchParams;
  const n = Number(page) || 1;
  return createMetadata({
    title: n > 1 ? `内容列表 · 第 ${n} 页` : "内容列表",
    description: "星舵内容库：科技趋势、AI 动态、开源项目与精选好文，支持原创与链接导入。",
    path: n > 1 ? `/news?page=${n}` : "/news",
  });
}

const shortDate = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: raw } = await searchParams;
  const all = await getAllArticles();
  const totalPages = pageCount(all.length, PAGE_SIZE);
  const page = Math.min(Math.max(Number(raw) || 1, 1), totalPages);
  const articles = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container py-7 sm:py-9">
      <header className="border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-xl font-semibold tracking-tight">内容列表</h1>
        <p className="mt-1 text-xs text-muted-foreground">共 {all.length} 条 · 原创为全文，聚合内容仅保留摘要。</p>
      </header>

      <ul className="border-b" style={{ borderColor: "var(--border)" }}>
        {articles.map((article, index) => (
          <li key={article.id} className="group border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
            <Link href={`/news/${article.slug}`} className="flex items-center gap-3 py-2.5 transition-colors hover:bg-accent/40">
              <span className="index-num w-5 shrink-0 group-hover:text-primary">
                {String((page - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
              </span>
              <time dateTime={article.publishedAt.toISOString()} className="index-num w-24 shrink-0">
                {shortDate.format(article.publishedAt)}
              </time>
              <span className="min-w-0 flex-1 truncate text-[13px] transition-colors group-hover:text-primary">
                {article.title}
              </span>
              {article.source !== "manual" && (
                <span className="index-num shrink-0">{article.source === "link" ? "导入" : "聚合"}</span>
              )}
              <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          </li>
        ))}
      </ul>

      <Pagination page={page} totalPages={totalPages} basePath="/news" />
    </div>
  );
}
