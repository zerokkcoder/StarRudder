import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteLedger } from "@/components/site-ledger";
import { getAllSites, getSiteCategories, getSitesByCategory } from "@/lib/queries";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "站点导航",
  description: "星舵站点导航：按分类浏览 AI 工具、设计灵感、开发资源与效率工具，每一条都经过人工筛选。",
  path: "/sites",
});

export default async function SitesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category = "all", q = "" } = await searchParams;
  const [allSites, categories] = await Promise.all([getAllSites(), getSiteCategories()]);
  const sites = await getSitesByCategory(category, q);

  const countFor = (slug: string) =>
    slug === "all"
      ? allSites.length
      : allSites.filter((site) => site.categoryId === categories.find((c) => c.slug === slug)?.id).length;

  return (
    <div className="container py-7 sm:py-9">
      <header className="border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-xl font-semibold tracking-tight">站点导航</h1>
        <p className="mt-1 text-xs text-muted-foreground">按分类浏览或检索，每条索引都经过人工筛选。</p>
      </header>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b py-3" style={{ borderColor: "var(--border)" }}>
        {[{ slug: "all", name: "全部" }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))].map((item) => (
          <Link
            key={item.slug}
            href={`/sites?category=${item.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`flex items-baseline gap-1 text-xs transition-colors ${
              category === item.slug ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.name}
            <span className="index-num">{String(countFor(item.slug)).padStart(2, "0")}</span>
          </Link>
        ))}
      </div>

      <form action="/sites" method="get" className="flex items-center gap-3 py-3">
        <input type="hidden" name="category" value={category} />
        <label htmlFor="site-q" className="index-num shrink-0">检索</label>
        <input
          id="site-q"
          name="q"
          defaultValue={q}
          placeholder="输入关键词…"
          className="h-8 min-w-0 flex-1 border-b bg-transparent text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
          style={{ borderColor: "var(--border)" }}
        />
        <button type="submit" className="index-num transition-colors hover:text-primary">
          搜索 <ArrowRight className="inline size-3" />
        </button>
      </form>

      <section>
        <div className="flex items-baseline justify-between border-b pb-2" style={{ borderColor: "var(--border)" }}>
          <h2 className="text-base font-semibold">
            {category === "all" ? "全部站点" : (categories.find((c) => c.slug === category)?.name ?? "站点")}
          </h2>
          <span className="index-num">共 {sites.length} 条</span>
        </div>
        <SiteLedger sites={sites} />
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t py-5" style={{ borderColor: "var(--border)" }}>
        <p className="flex-1 text-xs text-muted-foreground">没有找到你常去的站点？提交给我们，审核后收录。</p>
        <Link href="/submit" className="flex items-center gap-1 index-num transition-colors hover:text-primary">
          提交站点 <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
