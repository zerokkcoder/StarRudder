import type { Metadata } from "next";
import { createCategory, deleteCategory } from "@/app/admin/crud";
import { FormDialog } from "@/components/admin/form-dialog";
import { PAGE_SIZE, pageCount, Pagination } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { db, schema } from "@/db";

export const metadata: Metadata = { title: "分类管理", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const input = "h-8 w-full rounded-none border bg-transparent px-2 text-xs outline-none focus:border-primary";
const fieldLine = { borderColor: "var(--border)" };

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: raw } = await searchParams;
  const categories = await db.select().from(schema.categories);
  const totalPages = pageCount(categories.length, PAGE_SIZE);
  const page = Math.min(Math.max(Number(raw) || 1, 1), totalPages);
  const paged = categories.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="container py-7">
      <header className="flex items-end justify-between gap-4 border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <div>
          <h1 className="text-xl font-semibold tracking-tight">分类管理</h1>
          <p className="mt-1 text-xs text-muted-foreground">共 {categories.length} 个分类</p>
        </div>
        <FormDialog title="新增分类" trigger="＋ 新增分类">
          <form action={createCategory} className="mt-4 grid gap-3 sm:grid-cols-2">
            <input name="name" required placeholder="名称" className={input} style={fieldLine} />
            <input name="slug" placeholder="标识（留空自动生成）" className={input} style={fieldLine} />
            <select name="type" className={input} style={fieldLine}>
              <option value="site">站点分类</option>
              <option value="news">资讯分类</option>
            </select>
            <input name="sort" type="number" defaultValue={0} placeholder="排序" className={input} style={fieldLine} />
            <Button type="submit" size="sm" className="col-span-full w-fit rounded-none">添加分类</Button>
          </form>
        </FormDialog>
      </header>

      <ul className="border-b" style={{ borderColor: "var(--border)" }}>
        {paged.map((c) => (
          <li key={c.id} className="flex items-center gap-3 border-b py-2 last:border-b-0" style={{ borderColor: "var(--border)" }}>
            <span className="index-num w-6">{String(c.id).padStart(2, "0")}</span>
            <span className="w-28 text-xs font-medium">{c.name}</span>
            <span className="index-num flex-1">{c.slug}</span>
            <span className="index-num">{c.type === "site" ? "站点" : "资讯"}</span>
            <span className="index-num">排序 {c.sort}</span>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={c.id} />
              <Button type="submit" variant="ghost" size="xs" className="h-auto p-0 index-num hover:text-destructive">删除</Button>
            </form>
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={totalPages} basePath="/admin/categories" />
    </div>
  );
}
