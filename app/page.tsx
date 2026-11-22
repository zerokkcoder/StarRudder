import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CompassMark } from "@/components/compass-mark";
import { SiteLedger } from "@/components/site-ledger";
import { getAllSites, getSiteCategories } from "@/lib/queries";
import { createMetadata, JsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: `${siteConfig.name} · 发现值得停泊的好站`,
  path: "/",
});

export default async function HomePage() {
  const [sites, categories] = await Promise.all([
    getAllSites(),
    getSiteCategories(),
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "星舵站点索引",
    itemListElement: sites.map((site, index) => ({
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
          <span>已收录 {String(sites.length).padStart(2, "0")}</span>
          <span>方位 {String(categories.length).padStart(2, "0")}</span>
          <Link href="/submit" className="flex items-center gap-1 transition-colors hover:text-primary">
            提交站点 <ArrowRight className="size-3" />
          </Link>
        </div>
      </header>

      <section className="pt-5" aria-labelledby="site-directory">
        <div className="flex items-baseline justify-between border-b pb-2" style={{ borderColor: "var(--border)" }}>
          <h1 id="site-directory" className="text-lg font-semibold tracking-tight">站点索引</h1>
          <span className="index-num">共 {sites.length} 条</span>
        </div>
        <SiteLedger sites={sites} />
      </section>
    </div>
  );
}
