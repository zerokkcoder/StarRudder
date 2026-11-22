import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CompassMark } from "@/components/compass-mark";
import { SiteLedger } from "@/components/site-ledger";
import { getAllSites, getFriendLinks, getLatestArticles } from "@/lib/queries";
import { createMetadata, JsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: `${siteConfig.name} · 发现值得停泊的好站`,
  path: "/",
});

const shortDate = new Intl.DateTimeFormat("zh-CN", {
  month: "2-digit",
  day: "2-digit",
});

export default async function HomePage() {
  const [allSites, articles, links] = await Promise.all([
    getAllSites(),
    getLatestArticles(8),
    getFriendLinks(),
  ]);
  const featured = allSites.filter((site) => site.featured).slice(0, 6);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "星舵精选站点",
    itemListElement: featured.map((site, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: site.name,
      url: site.url,
    })),
  };

  return (
    <div className="container py-7 sm:py-9">
      <JsonLd schema={itemListJsonLd} />

      {/* 紧凑抬头 */}
      <header className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b pb-4" style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="flex items-center gap-2">
          <CompassMark className="size-5 text-primary" />
          <span className="text-base font-semibold tracking-tight">星舵</span>
        </Link>
        <p className="text-xs text-muted-foreground">发现值得停泊的好站</p>
        <div className="ml-auto flex items-center gap-4 index-num">
          <span>已收录 {String(allSites.length).padStart(2, "0")}</span>
          <span>资讯 {String(articles.length).padStart(2, "0")}</span>
          <Link href="/sites" className="flex items-center gap-1 transition-colors hover:text-primary">
            全部站点 <ArrowRight className="size-3" />
          </Link>
        </div>
      </header>

      {/* 首屏即见：最新资讯 */}
      <section className="pt-5" aria-labelledby="latest-news">
        <div className="flex items-baseline justify-between border-b pb-2" style={{ borderColor: "var(--border)" }}>
          <h1 id="latest-news" className="text-lg font-semibold tracking-tight">最新资讯</h1>
          <Link href="/news" className="index-num flex items-center gap-1 transition-colors hover:text-primary">
            查看全部 <ArrowRight className="size-3" />
          </Link>
        </div>
        <ul className="border-b" style={{ borderColor: "var(--border)" }}>
          {articles.map((article, index) => (
            <li key={article.id} className="group border-b last:border-b-0" style={{ borderColor: "var(--border)" }}>
              <Link href={`/news/${article.slug}`} className="flex items-center gap-3 py-2.5 transition-colors hover:bg-accent/40">
                <span className="index-num w-5 shrink-0 group-hover:text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <time dateTime={article.publishedAt.toISOString()} className="index-num w-12 shrink-0">
                  {shortDate.format(article.publishedAt)}
                </time>
                <span className="min-w-0 flex-1 truncate text-[13px] transition-colors group-hover:text-primary">
                  {article.title}
                </span>
                {article.source === "rss" && <span className="index-num shrink-0">聚合</span>}
                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 精选站点 */}
      <section className="pt-8" aria-labelledby="featured-sites">
        <div className="flex items-baseline justify-between border-b pb-2" style={{ borderColor: "var(--border)" }}>
          <h2 id="featured-sites" className="text-lg font-semibold tracking-tight">精选站点</h2>
          <Link href="/sites" className="index-num flex items-center gap-1 transition-colors hover:text-primary">
            查看全部 <ArrowRight className="size-3" />
          </Link>
        </div>
        <SiteLedger sites={featured} />
      </section>

      {/* 友情链接 */}
      <section className="pt-8 pb-12" aria-labelledby="friend-links">
        <div className="border-b pb-2" style={{ borderColor: "var(--border)" }}>
          <h2 id="friend-links" className="text-lg font-semibold tracking-tight">友情链接</h2>
        </div>
        <div className="grid gap-x-8 sm:grid-cols-2">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 border-b py-2.5 text-[13px] transition-colors hover:text-primary"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="index-num group-hover:text-primary">↗</span>
              <span className="font-medium">{link.name}</span>
              <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{link.description}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
