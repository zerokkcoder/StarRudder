import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { createRssSource, deleteRssSource, fetchRssNow } from "@/app/admin/crud";
import { Button } from "@/components/ui/button";
import { db, schema } from "@/db";

export const metadata: Metadata = { title: "订阅源", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const input = "h-8 w-full rounded-none border bg-transparent px-2 text-xs outline-none focus:border-primary";

export default async function AdminRssPage() {
  const [sources, categories] = await Promise.all([
    db.select().from(schema.rssSources),
    db.select().from(schema.categories).where(eq(schema.categories.type, "news")),
  ]);

  return (
    <div className="container py-7">
      <header className="flex items-end justify-between gap-4 border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">订阅源</h1>
          <p className="mt-1 text-xs text-muted-foreground">共 {sources.length} 个来源</p>
        </div>
        <form action={fetchRssNow}>
          <Button type="submit" size="sm" className="rounded-none">立即抓取</Button>
        </form>
      </header>

      <ul className="border-b" style={{ borderColor: "var(--border)" }}>
        {sources.map((source) => (
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

      <section className="pt-7">
        <h2 className="index-num border-b pb-2">新增订阅源</h2>
        <form action={createRssSource} className="mt-4 grid max-w-2xl gap-3 sm:grid-cols-2">
          <input name="name" required placeholder="来源名称" className={input} style={{ borderColor: "var(--border)" }} />
          <input name="url" required placeholder="订阅地址" className={input} style={{ borderColor: "var(--border)" }} />
          <select name="categoryId" className={input + " col-span-full"} style={{ borderColor: "var(--border)" }}>
            <option value="">未分类</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Button type="submit" size="sm" className="col-span-full w-fit rounded-none">添加订阅源</Button>
        </form>
      </section>
    </div>
  );
}
