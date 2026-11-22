import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { deleteArticle } from "@/app/admin/crud";
import { PAGE_SIZE, pageCount, Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { db, schema } from "@/db";

export const metadata: Metadata = { title: "内容管理", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const shortDate = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" });

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: raw } = await searchParams;
  const articles = await db.select().from(schema.articles).orderBy(desc(schema.articles.publishedAt));
  const totalPages = pageCount(articles.length, PAGE_SIZE);
  const page = Math.min(Math.max(Number(raw) || 1, 1), totalPages);
  const paged = articles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container py-7">
      <header className="flex items-end justify-between gap-4 border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">内容管理</h1>
          <p className="mt-1 text-xs text-muted-foreground">共 {articles.length} 条内容</p>
        </div>
        <Link href="/admin/articles/new" className="index-num hover:text-primary">＋ 新建内容</Link>
      </header>

      <ul className="border-b" style={{ borderColor: "var(--border)" }}>
        {paged.map((article) => (
          <li key={article.id} className="flex items-center gap-3 border-b py-2 last:border-b-0" style={{ borderColor: "var(--border)" }}>
            <span className="index-num w-6">{String(article.id).padStart(2, "0")}</span>
            <span className="min-w-0 flex-1 truncate text-xs">{article.title}</span>
            <span className="index-num shrink-0">
              {article.source === "rss" ? "聚合" : article.source === "link" ? "导入" : "原创"}
            </span>
            <span className="index-num shrink-0">{shortDate.format(article.publishedAt)}</span>
            <form action={deleteArticle}>
              <input type="hidden" name="id" value={article.id} />
              <Button type="submit" variant="ghost" size="xs" className="h-auto p-0 index-num hover:text-destructive">删除</Button>
            </form>
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={totalPages} basePath="/admin/articles" />
    </div>
  );
}
