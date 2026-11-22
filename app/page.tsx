import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CompassMark } from "@/components/compass-mark";
import { PAGE_SIZE, pageCount, Pagination } from "@/components/pagination";
import { SiteLedger } from "@/components/site-ledger";
import { getAllSites, getSiteCategories, getSitesByCategory } from "@/lib/queries";
import { createMetadata, JsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: `${siteConfig.name} · 发现值得停泊的好站`,
  path: "/",
});

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const { category = "all", q = "", page: rawPage } = await searchParams;
  const [allSites, categories] = await Promise.all([
    getAllSites(),
    getSiteCategories(),
  ]);
  const filtered = await getSitesByCategory(category, q);
  const totalPages = pageCount(filtered.length, PAGE_SIZE);
  const page = Math.min(Math.max(Number(rawPage) || 1, 1), totalPages);
  const sites = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const countFor = (slug: string) =>
    slug === "all"
      ? allSites.length
      : allSites.filter((site) => site.categoryId === categories.find((c) => c.slug === slug)?.id).length;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "星舵站点索引",
    itemListElement: allSites.map((site, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: site.name,
      url: site.url,
    })),
  };

  return (
    <div className="container py-7 sm:py-9">
      <JsonLd schema={itemListJsonLd} />

      <header className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b pb-4" style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="flex items-center gap-2">
          <CompassMark className="size-5 text-primary" />
          <span className="text-base font-semibold tracking-tight">星舵</span>
        </Link>
        <p className="text-xs text-muted-foreground">发现值得停泊的好站</p>
        <div className="ml-auto flex items-center gap-4 index-num">
          <span>已收录 {String(allSites.length).padStart(2, "0")}</span>
          <Link href="/submit" className="flex items-center gap-1 transition-colors hover:text-primary">
            提交站点 <ArrowRight className="size-3" />
          </Link>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b py-3" style={{ borderColor: "var(--border)" }}>
        {[{ slug: "all", name: "全部" }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))].map((item) => (
          <Link
            key={item.slug}
            href={`/?category=${item.slug}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`flex items-baseline gap-1 text-xs transition-colors ${
              category === item.slug ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.name}
            <span className="index-num">{String(countFor(item.slug)).padStart(2, "0")}</span>
          </Link>
        ))}
      </div>

      <form action="/" method="get" className="flex items-center gap-3 py-3">
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

      <section aria-labelledby="site-directory">
        <div className="flex items-baseline justify-between border-b pb-2" style={{ borderColor: "var(--border)" }}>
          <h1 id="site-directory" className="text-base font-semibold tracking-tight">站点索引</h1>
          <span className="index-num">共 {filtered.length} 条</span>
        </div>
        <SiteLedger sites={sites} />
        <Pagination page={page} totalPages={totalPages} basePath="/" params={{ category, q }} />
      </section>
    </div>
  );
}
