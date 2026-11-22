import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { CompassMark } from "@/components/compass-mark";
import { AdminThemeToggle } from "@/components/admin/admin-theme-toggle";

const menu = [
  { href: "/admin", label: "后台首页" },
  { href: "/admin/seo", label: "搜索引擎" },
  { href: "/admin/sites", label: "站点管理" },
  { href: "/admin/categories", label: "分类管理" },
  { href: "/admin/articles", label: "内容管理" },
  { href: "/admin/articles/import", label: "链接导入" },
  { href: "/admin/rss-sources", label: "订阅源" },
  { href: "/admin/friend-links", label: "友情链接" },
  { href: "/admin/submissions", label: "提交审核" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div id="admin-root" data-theme="dark" className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[152px] flex-col border-r px-4 py-5" style={{ borderColor: "var(--border)" }}>
        <Link href="/admin" className="flex items-center gap-2">
          <CompassMark className="size-6 text-primary" />
          <span>
            <span className="block text-sm font-semibold">星舵</span>
            <span className="index-num block">管理后台</span>
          </span>
        </Link>

        <nav className="mt-8 flex flex-col gap-0.5" aria-label="后台导航">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-l-2 border-transparent py-1.5 pl-2.5 text-[13px] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-3 border-t pt-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <Link href="/" className="index-num hover:text-primary">返回站点 ↗</Link>
            <AdminThemeToggle />
          </div>
          <form action={logout}>
            <Button type="submit" variant="ghost" size="xs" className="h-auto p-0 index-num hover:text-primary">
              退出登录
            </Button>
          </form>
        </div>
      </aside>

      <div className="ml-[152px] min-h-screen">{children}</div>
    </div>
  );
}
