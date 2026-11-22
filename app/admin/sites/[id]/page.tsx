import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { updateSite } from "@/app/admin/crud";
import { Button } from "@/components/ui/button";
import { db, schema } from "@/db";

export const metadata: Metadata = { title: "编辑站点", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const input = "h-8 w-full rounded-none border bg-transparent px-2 text-xs outline-none focus:border-primary";

export default async function EditSitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: raw } = await params;
  const id = Number(raw);
  if (!Number.isInteger(id)) notFound();
  const [site] = await db.select().from(schema.sites).where(eq(schema.sites.id, id)).limit(1);
  if (!site) notFound();
  const categories = await db.select().from(schema.categories);

  return (
    <div className="container py-7">
      <header className="border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <Link href="/admin/sites" className="index-num hover:text-primary">← 返回站点列表</Link>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">编辑站点 · {site.name}</h1>
      </header>

      <form action={updateSite} className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-2">
        <input type="hidden" name="id" value={site.id} />
        <input name="name" required defaultValue={site.name} placeholder="名称" className={input} style={{ borderColor: "var(--border)" }} />
        <input name="slug" defaultValue={site.slug} placeholder="标识" className={input} style={{ borderColor: "var(--border)" }} />
        <input name="url" required defaultValue={site.url} placeholder="网址" className={input + " col-span-full"} style={{ borderColor: "var(--border)" }} />
        <input name="description" defaultValue={site.description} placeholder="简介" className={input + " col-span-full"} style={{ borderColor: "var(--border)" }} />
        <select name="categoryId" defaultValue={site.categoryId ?? ""} className={input} style={{ borderColor: "var(--border)" }}>
          <option value="">未分类</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input name="tags" defaultValue={site.tags.join("，")} placeholder="标签（逗号分隔）" className={input} style={{ borderColor: "var(--border)" }} />
        <select name="status" defaultValue={site.status} className={input} style={{ borderColor: "var(--border)" }}>
          <option value="active">正常</option>
          <option value="hidden">隐藏</option>
        </select>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" name="featured" defaultChecked={site.featured} className="accent-[var(--primary)]" /> 设为精选
        </label>
        <Button type="submit" size="sm" className="col-span-full w-fit rounded-none">保存修改</Button>
      </form>
    </div>
  );
}
