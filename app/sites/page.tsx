import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { SiteLedger } from "@/components/site-ledger";
import { getAllSites, getSiteCategories, getSitesByCategory } from "@/lib/queries";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "站点导航",
  description: "星舵站点导航：按方位分类浏览 AI 工具、设计灵感、开发资源与效率工具，每一条都经过人工筛选。",
  path: "/sites",
});

export default async function SitesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category = "all", q = "" } = await searchParams;
  const [allSites, categories] = await Promise.all([
    getAllSites(),
    getSiteCategories(),
  ]);
  const sites = await getSitesByCategory(category, q);

  const countFor = (slug: string) =>
    slug === "all"
      ? allSites.length
      : allSites.filter((site) => {
          const cat = categories.find((c) => c.id === site.categoryId);
          return cat?.slug === slug;
        }).length;

  return (
    <div className="container py-20 sm:py-28">
      <header>
        <div className="flex items-center gap-3">
          <span className="index-num text-primary">02 / DIRECTORY</span>
          <span className="index-num uppercase tracking-[0.2em]">Bearings & entries</span>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">站点索引</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
          按方位分类浏览，或使用检索缩小范围。每条索引都指向 `/go` 计数跳转，点击后在新标签页打开。
        </p>
      </header>

      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-b pb-4" style={{ borderColor: "var(--border)" }}>
        {[{ slug: "all", name: "全部" }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))].map((item) => (
          <Link
            key={item.slug}
            href={`/sites?category=${item.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`flex items-baseline gap-1.5 border-b-2 pb-1 text-xs transition-colors ${
              category === item.slug
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.name}
            <span className="index-num">{String(countFor(item.slug)).padStart(2, "0")}</span>
          </Link>
        ))}
      </div>

      <form action="/sites" method="get" className="mt-5 flex max-w-md items-center gap-3">
        <input type="hidden" name="category" value={category} />
        <label htmlFor="site-q" className="index-num shrink-0">QUERY</label>
        <input
          id="site-q"
          name="q"
          defaultValue={q}
          placeholder="输入关键词检索索引…"
          className="h-9 min-w-0 flex-1 border-b bg-transparent text-sm outline-none placeholder:text-muted-foreground focus:border-primary"
          style={{ borderColor: "var(--border)" }}
        />
        <button type="submit" className="index-num transition-colors hover:text-primary">
          检索 <ArrowRight className="inline size-3" />
        </button>
      </form>

      <section className="mt-10">
        <SectionHeading
          number={String(categories.findIndex((c) => c.slug === category) + 1).padStart(2, "0")}
          label={category === "all" ? "All bearings" : category}
          title={category === "all" ? "全部条目" : (categories.find((c) => c.slug === category)?.name ?? "索引")}
        />
        <SiteLedger sites={sites} />
      </section>

      <div className="mt-16 flex flex-wrap items-center gap-4 border-t pt-8" style={{ borderColor: "var(--border)" }}>
        <p className="flex-1 text-xs text-muted-foreground">没有找到你常去的站点？提交给我们，审核后收录。</p>
        <Link href="/submit" className="flex items-center gap-2 index-num transition-colors hover:text-primary">
          提交条目 <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
