import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";

export const metadata: Metadata = {
  title: "管理后台",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [siteRows, articleRows, categoryRows, linkRows, sourceRows, submissionRows] = await Promise.all([
    db.select({ id: schema.sites.id }).from(schema.sites),
    db.select({ id: schema.articles.id }).from(schema.articles),
    db.select({ id: schema.categories.id }).from(schema.categories),
    db.select({ id: schema.friendLinks.id }).from(schema.friendLinks),
    db.select({ id: schema.rssSources.id }).from(schema.rssSources),
    db.select().from(schema.submissions).where(eq(schema.submissions.status, "pending")).orderBy(desc(schema.submissions.createdAt)).limit(5),
  ]);

  const stats = [
    { label: "站点", value: siteRows.length },
    { label: "资讯", value: articleRows.length },
    { label: "分类", value: categoryRows.length },
    { label: "友链", value: linkRows.length },
    { label: "订阅源", value: sourceRows.length },
    { label: "待审核", value: submissionRows.length },
  ];

  return (
    <div className="container py-7 sm:py-9">
      <header className="border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-xl font-semibold tracking-tight">管理后台</h1>
        <p className="mt-1 text-xs text-muted-foreground">站点索引的内容总览与日常管理。</p>
      </header>

      <div className="grid grid-cols-3 gap-px border sm:grid-cols-6" style={{ borderColor: "var(--border)", background: "var(--border)" }}>
        {stats.map((stat) => (
          <div key={stat.label} className="bg-background px-3 py-4">
            <p className="index-num">{stat.label}</p>
            <p className="mt-1 text-xl font-medium tabular-nums">{String(stat.value).padStart(2, "0")}</p>
          </div>
        ))}
      </div>

      {submissionRows.length > 0 && (
        <section className="pt-7">
          <h2 className="index-num border-b pb-2">最近待审</h2>
          <ul>
            {submissionRows.map((item) => (
              <li key={item.id} className="flex items-center gap-3 border-b py-2 text-xs" style={{ borderColor: "var(--border)" }}>
                <span className="index-num">{item.type === "link" ? "友链" : "站点"}</span>
                <span className="font-medium">{item.name}</span>
                <span className="min-w-0 flex-1 truncate text-muted-foreground">{item.url}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
