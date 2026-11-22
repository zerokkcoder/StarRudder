import type { Metadata } from "next";
import { createFriendLink, deleteFriendLink } from "@/app/admin/crud";
import { Button } from "@/components/ui/button";
import { db, schema } from "@/db";

export const metadata: Metadata = { title: "友情链接", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const input = "h-8 w-full rounded-none border bg-transparent px-2 text-xs outline-none focus:border-primary";

export default async function AdminLinksPage() {
  const links = await db.select().from(schema.friendLinks);

  return (
    <div className="container py-7">
      <header className="border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-xl font-semibold tracking-tight">友情链接</h1>
        <p className="mt-1 text-xs text-muted-foreground">共 {links.length} 条友链</p>
      </header>

      <ul className="border-b" style={{ borderColor: "var(--border)" }}>
        {links.map((link) => (
          <li key={link.id} className="flex items-center gap-3 border-b py-2 last:border-b-0" style={{ borderColor: "var(--border)" }}>
            <span className="index-num w-6">{String(link.id).padStart(2, "0")}</span>
            <span className="w-32 shrink-0 truncate text-xs font-medium">{link.name}</span>
            <span className="index-num min-w-0 flex-1 truncate">{link.url}</span>
            <span className="index-num">排序 {link.sort}</span>
            <form action={deleteFriendLink}>
              <input type="hidden" name="id" value={link.id} />
              <Button type="submit" variant="ghost" size="xs" className="h-auto p-0 index-num hover:text-destructive">删除</Button>
            </form>
          </li>
        ))}
      </ul>

      <section className="pt-7">
        <h2 className="index-num border-b pb-2">新增友链</h2>
        <form action={createFriendLink} className="mt-4 grid max-w-2xl gap-3 sm:grid-cols-2">
          <input name="name" required placeholder="名称" className={input} style={{ borderColor: "var(--border)" }} />
          <input name="url" required placeholder="网址" className={input} style={{ borderColor: "var(--border)" }} />
          <input name="description" placeholder="简介" className={input + " col-span-full"} style={{ borderColor: "var(--border)" }} />
          <input name="sort" type="number" defaultValue={0} placeholder="排序" className={input} style={{ borderColor: "var(--border)" }} />
          <Button type="submit" size="sm" className="col-span-full w-fit rounded-none">添加友链</Button>
        </form>
      </section>
    </div>
  );
}
