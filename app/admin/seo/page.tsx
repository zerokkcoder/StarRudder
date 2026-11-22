import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "搜索引擎优化",
  robots: { index: false, follow: false },
};

const checks = [
  { label: "每页元数据与 canonical", ok: true },
  { label: "站点地图 sitemap.xml", ok: true },
  { label: "爬虫规则 robots.txt", ok: true },
  { label: "结构化数据 JSON-LD", ok: true },
  { label: "静态化 / ISR", ok: true },
  { label: "语义化 HTML 与 alt", ok: true },
  { label: "Google 验证 meta", ok: Boolean(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) },
];

const jsonLdTypes = ["WebSite", "Organization", "ItemList", "Article"];

export default function AdminSeoPage() {
  const base = siteConfig.url.replace(/\/$/, "");

  return (
    <div className="container py-7">
      <header className="border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-xl font-semibold tracking-tight">搜索引擎优化</h1>
        <p className="mt-1 text-xs text-muted-foreground">当前站点的 SEO 配置状态与关键词跟踪。</p>
      </header>

      <section className="pt-6">
        <h2 className="index-num border-b pb-2">基础配置</h2>
        <dl className="grid gap-x-8 sm:grid-cols-2">
          <div className="flex items-center justify-between border-b py-2.5 text-xs" style={{ borderColor: "var(--border)" }}>
            <dt className="text-muted-foreground">生产域名</dt>
            <dd>{base}</dd>
          </div>
          <div className="flex items-center justify-between border-b py-2.5 text-xs" style={{ borderColor: "var(--border)" }}>
            <dt className="text-muted-foreground">站点语言</dt>
            <dd>zh-CN</dd>
          </div>
          <div className="flex items-center justify-between border-b py-2.5 text-xs" style={{ borderColor: "var(--border)" }}>
            <dt className="text-muted-foreground">站点地图</dt>
            <dd><Link href="/sitemap.xml" className="hover:text-primary">查看 →</Link></dd>
          </div>
          <div className="flex items-center justify-between border-b py-2.5 text-xs" style={{ borderColor: "var(--border)" }}>
            <dt className="text-muted-foreground">爬虫规则</dt>
            <dd><Link href="/robots.txt" className="hover:text-primary">查看 →</Link></dd>
          </div>
        </dl>
      </section>

      <section className="pt-7">
        <h2 className="index-num border-b pb-2">已完成项</h2>
        <ul>
          {checks.map((item) => (
            <li key={item.label} className="flex items-center gap-3 border-b py-2 text-xs" style={{ borderColor: "var(--border)" }}>
              <span className={item.ok ? "text-primary" : "text-destructive"}>{item.ok ? "✓" : "✕"}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-x-10 sm:grid-cols-2">
        <section className="pt-7">
          <h2 className="index-num border-b pb-2">结构化数据</h2>
          <p className="py-3 text-xs text-muted-foreground">{jsonLdTypes.join(" · ")}</p>
        </section>
        <section className="pt-7">
          <h2 className="index-num border-b pb-2">重点关键词</h2>
          <div className="flex flex-wrap gap-1.5 py-3">
            {siteConfig.keywords.map((keyword) => (
              <span key={keyword} className="border px-2 py-1 text-[11px]" style={{ borderColor: "var(--border)" }}>{keyword}</span>
            ))}
          </div>
        </section>
      </div>

      <section className="pt-7">
        <h2 className="index-num border-b pb-2">持续改进</h2>
        <p className="py-3 text-xs leading-6 text-muted-foreground">
          每周用 Google Trends 找上升词，落到分类、标签与原创资讯；在 Search Console 跟踪展示、点击与排名。完整流程见项目文档 <code className="font-mono text-primary">docs/SEO.md</code>。
        </p>
      </section>
    </div>
  );
}
