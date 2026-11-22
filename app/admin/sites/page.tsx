import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { createSite, deleteSite, updateSite } from "@/app/admin/crud";
import { FormDialog } from "@/components/admin/form-dialog";
import { PAGE_SIZE, pageCount, Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { db, schema } from "@/db";

export const metadata: Metadata = { title: "站点管理", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const input = "h-8 w-full rounded-none border bg-transparent px-2 text-xs outline-none focus:border-primary";
const fieldLine = { borderColor: "var(--border)" };

function SiteForm({
  categories,
  site,
  action,
}: {
  categories: { id: number; name: string }[];
  site?: typeof schema.sites.$inferSelect;
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="mt-4 grid gap-3 sm:grid-cols-2">
      {site && <input type="hidden" name="id" value={site.id} />}
      <input name="name" required defaultValue={site?.name} placeholder="名称" className={input} style={fieldLine} />
      <input name="slug" defaultValue={site?.slug} placeholder="标识（留空自动生成）" className={input} style={fieldLine} />
      <input name="url" required defaultValue={site?.url} placeholder="网址" className={`${input} col-span-full`} style={fieldLine} />
      <input name="description" defaultValue={site?.description} placeholder="简介" className={`${input} col-span-full`} style={fieldLine} />
      <select name="categoryId" defaultValue={site?.categoryId ?? ""} className={input} style={fieldLine}>
        <option value="">未分类</option>
        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input name="tags" defaultValue={site?.tags?.join("，")} placeholder="标签（逗号分隔）" className={input} style={fieldLine} />
      <select name="status" defaultValue={site?.status ?? "active"} className={input} style={fieldLine}>
        <option value="active">正常</option>
        <option value="hidden">隐藏</option>
      </select>
      <label className="flex items-center gap-2 text-xs">
        <input type="checkbox" name="featured" defaultChecked={site?.featured} className="accent-[var(--primary)]" /> 设为精选
      </label>
      <Button type="submit" size="sm" className="col-span-full w-fit rounded-none">
        {site ? "保存修改" : "添加站点"}
      </Button>
    </form>
  );
}

export default async function AdminSitesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: raw } = await searchParams;
  const [sites, categories] = await Promise.all([
    db.select().from(schema.sites),
    db.select().from(schema.categories).where(eq(schema.categories.type, "site")),
  ]);
  const totalPages = pageCount(sites.length, PAGE_SIZE);
  const page = Math.min(Math.max(Number(raw) || 1, 1), totalPages);
  const paged = sites.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container py-7">
      <header className="flex items-end justify-between gap-4 border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">站点管理</h1>
          <p className="mt-1 text-xs text-muted-foreground">共 {sites.length} 个站点</p>
        </div>
        <FormDialog title="新增站点" trigger="＋ 新增站点">
          <SiteForm categories={categories} action={createSite} />
        </FormDialog>
      </header>

      <ul className="border-b" style={{ borderColor: "var(--border)" }}>
        {paged.map((site) => (
          <li key={site.id} className="flex items-center gap-3 border-b py-2 last:border-b-0" style={{ borderColor: "var(--border)" }}>
            <span className="index-num w-6">{String(site.id).padStart(2, "0")}</span>
            <span className="w-32 shrink-0 truncate text-xs font-medium">{site.name}</span>
            <span className="index-num min-w-0 flex-1 truncate">{site.url}</span>
            {site.featured && <span className="index-num text-primary">精选</span>}
            <span className="index-num">{site.status}</span>
            <FormDialog title={`编辑 · ${site.name}`} trigger="编辑" variant="ghost">
              <SiteForm categories={categories} site={site} action={updateSite} />
            </FormDialog>
            <form action={deleteSite}>
              <input type="hidden" name="id" value={site.id} />
              <Button type="submit" variant="ghost" size="xs" className="h-auto p-0 index-num hover:text-destructive">删除</Button>
            </form>
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={totalPages} basePath="/admin/sites" />
    </div>
  );
}
