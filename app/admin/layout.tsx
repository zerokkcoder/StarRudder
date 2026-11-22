import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return (
    <div className="admin-shell">
      <nav className="container flex gap-5 pt-6 index-num" aria-label="后台导航">
        <Link href="/admin/submissions" className="hover:text-primary">提交审核</Link>
        <Link href="/admin/articles/new" className="hover:text-primary">新建资讯</Link>
        <Link href="/" className="ml-auto hover:text-primary">返回站点 ↗</Link>
      </nav>
      {children}
    </div>
  );
}
