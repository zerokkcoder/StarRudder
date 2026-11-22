import type { Metadata } from "next";
import { desc } from "drizzle-orm";
import { approveSubmission, logout, rejectSubmission } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { db, schema } from "@/db";

export const metadata: Metadata = {
  title: "提交审核",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export default async function SubmissionsPage() {
  const submissions = await db
    .select()
    .from(schema.submissions)
    .orderBy(desc(schema.submissions.createdAt));
  const pending = submissions.filter((item) => item.status === "pending");

  return (
    <div className="container py-14 sm:py-20">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b pb-5" style={{ borderColor: "var(--border)" }}>
        <div>
          <p className="index-num text-primary">后台 / 提交审核</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">提交审核</h1>
          <p className="mt-2 text-xs text-muted-foreground">待处理 {pending.length} 条 · 总计 {submissions.length} 条</p>
        </div>
        <form action={logout}>
          <Button type="submit" variant="outline" size="sm" className="rounded-none">退出登录</Button>
        </form>
      </header>

      <section className="mt-10">
        <h2 className="index-num mb-4">待处理</h2>
        {pending.length === 0 ? (
          <p className="border py-12 text-center text-sm text-muted-foreground" style={{ borderColor: "var(--border)" }}>
            没有待处理的提交。
          </p>
        ) : (
          <ul className="border-t" style={{ borderColor: "var(--border)" }}>
            {pending.map((item, index) => (
              <li key={item.id} className="border-b py-4" style={{ borderColor: "var(--border)" }}>
                <div className="flex flex-wrap items-start gap-4">
                  <span className="index-num w-6 shrink-0">{String(index + 1).padStart(2, "0")}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {item.name}
                      <span className="index-num ml-2">{item.type === "link" ? "友链" : "站点"}</span>
                    </p>
                    <p className="index-num mt-1 break-all">{item.url}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{item.description || "（无简介）"}</p>
                    <p className="index-num mt-2">
                      {dateFormatter.format(item.createdAt)}{item.email ? ` · ${item.email}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <form action={approveSubmission}>
                      <input type="hidden" name="id" value={item.id} />
                      <Button type="submit" size="sm" className="rounded-none">收录</Button>
                    </form>
                    <form action={rejectSubmission}>
                      <input type="hidden" name="id" value={item.id} />
                      <Button type="submit" size="sm" variant="outline" className="rounded-none">忽略</Button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-14">
        <h2 className="index-num mb-4">已处理</h2>
        <ul className="border-t" style={{ borderColor: "var(--border)" }}>
          {submissions
            .filter((item) => item.status !== "pending")
            .map((item) => (
              <li key={item.id} className="flex items-center gap-4 border-b py-3" style={{ borderColor: "var(--border)" }}>
                <span className="index-num w-14">{item.status === "approved" ? "已收录" : "已忽略"}</span>
                <span className="text-sm">{item.name}</span>
                <span className="index-num ml-auto">{dateFormatter.format(item.createdAt)}</span>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
