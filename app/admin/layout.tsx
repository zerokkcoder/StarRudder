import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="admin-shell">
      <nav className="container flex flex-wrap gap-x-4 gap-y-2 pt-5 index-num" aria-label="后台导航">
        <Link href="/admin" className="hover:text-primary">后台首页</Link>
        <Link href="/admin/sites" className="hover:text-primary">站点</Link>
        <Link href="/admin/categories" className="hover:text-primary">分类</Link>
        <Link href="/admin/articles" className="hover:text-primary">资讯</Link>
        <Link href="/admin/rss-sources" className="hover:text-primary">订阅源</Link>
        <Link href="/admin/friend-links" className="hover:text-primary">友链</Link>
        <Link href="/admin/submissions" className="hover:text-primary">审核</Link>
        <Link href="/" className="ml-auto hover:text-primary">返回站点 ↗</Link>
        <form action={logout}>
          <Button type="submit" variant="ghost" size="xs" className="h-auto p-0 index-num hover:text-primary">退出</Button>
        </form>
      </nav>
      {children}
    </div>
  );
}
