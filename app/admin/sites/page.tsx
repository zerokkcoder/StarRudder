import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { createSite, deleteSite } from "@/app/admin/crud";
import { Button } from "@/components/ui/button";
import { db, schema } from "@/db";

export const metadata: Metadata = { title: "站点管理", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const input = "h-8 w-full rounded-none border bg-transparent px-2 text-xs outline-none focus:border-primary";

export default async function AdminSitesPage() {
  const [sites, categories] = await Promise.all([
    db.select().from(schema.sites),
    db.select().from(schema.categories).where(eq(schema.categories.type, "site")),
  ]);

  return (
    <div className="container py-7">
      <header className="border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-xl font-semibold tracking-tight">站点管理</h1>
        <p className="mt-1 text-xs text-muted-foreground">共 {sites.length} 个站点</p>
      </header>

      <ul className="border-b" style={{ borderColor: "var(--border)" }}>
        {sites.map((site) => (
          <li key={site.id} className="flex items-center gap-3 border-b py-2 last:border-b-0" style={{ borderColor: "var(--border)" }}>
            <span className="index-num w-6">{String(site.id).padStart(2, "0")}</span>
            <span className="w-32 shrink-0 truncate text-xs font-medium">{site.name}</span>
            <span className="index-num min-w-0 flex-1 truncate">{site.url}</span>
            {site.featured && <span className="index-num text-primary">精选</span>}
            <span className="index-num">{site.status}</span>
            <Link href={`/admin/sites/${site.id}`} className="index-num hover:text-primary">编辑</Link>
            <form action={deleteSite}>
              <input type="hidden" name="id" value={site.id} />
              <Button type="submit" variant="ghost" size="xs" className="h-auto p-0 index-num hover:text-destructive">删除</Button>
            </form>
          </li>
        ))}
      </ul>

      <section className="pt-7">
        <h2 className="index-num border-b pb-2">新增站点</h2>
        <form action={createSite} className="mt-4 grid max-w-2xl gap-3 sm:grid-cols-2">
          <input name="name" required placeholder="名称" className={input} style={{ borderColor: "var(--border)" }} />
          <input name="slug" placeholder="标识（留空自动生成）" className={input} style={{ borderColor: "var(--border)" }} />
          <input name="url" required placeholder="网址" className="col-span-full" style={{ borderColor: "var(--border)" }} />
          <input name="description" placeholder="简介" className={input + " col-span-full"} style={{ borderColor: "var(--border)" }} />
          <select name="categoryId" className={input} style={{ borderColor: "var(--border)" }}>
            <option value="">未分类</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input name="tags" placeholder="标签（逗号分隔）" className={input} style={{ borderColor: "var(--border)" }} />
          <select name="status" className={input} style={{ borderColor: "var(--border)" }}>
            <option value="active">正常</option>
            <option value="hidden">隐藏</option>
          </select>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" name="featured" className="accent-[var(--primary)]" /> 设为精选
          </label>
          <Button type="submit" size="sm" className="col-span-full w-fit rounded-none">添加站点</Button>
        </form>
      </section>
    </div>
  );
}
