import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { createRssSource, deleteRssSource, fetchRssNow } from "@/app/admin/crud";
import { FormDialog } from "@/components/admin/form-dialog";
import { PAGE_SIZE, pageCount, Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { db, schema } from "@/db";

export const metadata: Metadata = { title: "订阅源", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const input = "h-8 w-full rounded-none border bg-transparent px-2 text-xs outline-none focus:border-primary";
const fieldLine = { borderColor: "var(--border)" };

export default async function AdminRssPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: raw } = await searchParams;
  const [sources, categories] = await Promise.all([
    db.select().from(schema.rssSources),
    db.select().from(schema.categories).where(eq(schema.categories.type, "news")),
  ]);
  const totalPages = pageCount(sources.length, PAGE_SIZE);
  const page = Math.min(Math.max(Number(raw) || 1, 1), totalPages);
  const paged = sources.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container py-7">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">订阅源</h1>
          <p className="mt-1 text-xs text-muted-foreground">共 {sources.length} 个来源</p>
        </div>
        <div className="flex gap-2">
          <FormDialog title="新增订阅源" trigger="＋ 新增订阅源">
            <form action={createRssSource} className="mt-4 grid gap-3">
              <input name="name" required placeholder="来源名称" className={input} style={fieldLine} />
              <input name="url" required placeholder="订阅地址" className={input} style={fieldLine} />
              <select name="categoryId" className={input} style={fieldLine}>
                <option value="">未分类</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <Button type="submit" size="sm" className="w-fit rounded-none">添加订阅源</Button>
            </form>
          </FormDialog>
          <form action={fetchRssNow}>
            <Button type="submit" size="sm" className="rounded-none">立即抓取</Button>
          </form>
        </div>
      </header>

      <ul className="border-b" style={{ borderColor: "var(--border)" }}>
        {paged.map((source) => (
          <li key={source.id} className="flex items-center gap-3 border-b py-2 last:border-b-0" style={{ borderColor: "var(--border)" }}>
            <span className="index-num w-6">{String(source.id).padStart(2, "0")}</span>
            <span className="w-36 shrink-0 truncate text-xs font-medium">{source.name}</span>
            <span className="index-num min-w-0 flex-1 truncate">{source.url}</span>
            <span className="index-num">{source.lastFetchedAt ? "已抓取" : "未抓取"}</span>
            <form action={deleteRssSource}>
              <input type="hidden" name="id" value={source.id} />
              <Button type="submit" variant="ghost" size="xs" className="h-auto p-0 index-num hover:text-destructive">删除</Button>
            </form>
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={totalPages} basePath="/admin/rss-sources" />
    </div>
  );
}
