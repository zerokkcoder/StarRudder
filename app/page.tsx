import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CompassMark } from "@/components/compass-mark";
import { HeroCompass } from "@/components/hero-compass";
import { SectionHeading } from "@/components/section-heading";
import { SiteLedger } from "@/components/site-ledger";
import { getFeaturedSites, getFriendLinks, getLatestArticles, getSiteCategories } from "@/lib/queries";
import { createMetadata, JsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: `${siteConfig.name} ${siteConfig.nameEn} · 发现值得停泊的好站`,
  path: "/",
});

const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export default async function HomePage() {
  const [featuredSites, latestArticles, links, categories] = await Promise.all([
    getFeaturedSites(),
    getLatestArticles(),
    getFriendLinks(),
    getSiteCategories(),
  ]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "星舵精选站点",
    itemListElement: featuredSites.map((site, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: site.name,
      url: site.url,
    })),
  };

  return (
    <>
      <JsonLd schema={itemListJsonLd} />

      {/* 01 / PREFACE */}
      <section data-section="hero" className="chart-grid relative overflow-hidden border-b" style={{ borderColor: "var(--border)" }}>
        <div className="container grid items-center gap-12 py-24 sm:py-32 lg:grid-cols-[1fr_auto] lg:py-40">
          <div>
            <div className="rise flex items-center gap-3">
              <CompassMark className="size-5 text-primary" />
              <span className="index-num uppercase tracking-[0.2em] text-primary">
                01 / Preface — Index of the useful web
              </span>
            </div>
            <h1 className="mt-8 text-balance text-[2.6rem] leading-[1.12] font-semibold tracking-[-0.035em] sm:text-6xl lg:text-[4.2rem]">
              <span className="rise rise-delay-1 block">在信息的海洋里，</span>
              <span className="rise rise-delay-2 block">找到值得停泊的</span>
              <span className="rise rise-delay-3 block text-primary">好站。</span>
            </h1>
            <p className="rise rise-delay-3 mt-8 max-w-lg text-sm leading-7 text-muted-foreground sm:text-base">
              {siteConfig.slogan}。这是一份持续修订的索引，只收录真正值得再次打开的工具与内容。
            </p>

            <div className="rise rise-delay-3 mt-12 flex flex-wrap items-center gap-x-10 gap-y-4 border-t pt-6" style={{ borderColor: "var(--border)" }}>
              <div>
                <p className="index-num">INDEXED</p>
                <p className="mt-1 text-lg font-medium tabular-nums">{String(featuredSites.length).padStart(2, "0")}</p>
              </div>
              <div>
                <p className="index-num">BEARINGS</p>
                <p className="mt-1 text-lg font-medium tabular-nums">{String(categories.length).padStart(2, "0")}</p>
              </div>
              <div>
                <p className="index-num">JOURNAL</p>
                <p className="mt-1 text-lg font-medium tabular-nums">{String(latestArticles.length).padStart(2, "0")}</p>
              </div>
              <Link href="/sites" className="group ml-auto flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary">
                进入索引
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <HeroCompass />
        </div>
      </section>

      {/* 02 / SELECTED HARBORS */}
      <section data-section="featured" className="container py-20 sm:py-28">
        <SectionHeading
          number="02"
          label="Selected Harbors"
          title="精选索引"
          id="featured-heading"
          action={
            <Link href="/sites" className="group flex items-center gap-2 index-num transition-colors hover:text-primary">
              ALL ENTRIES
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />
        <SiteLedger sites={featuredSites} />
      </section>

      {/* 03 / JOURNAL */}
      <section data-section="journal" className="container pb-20 sm:pb-28">
        <SectionHeading
          number="03"
          label="The Journal"
          title="航海日志"
          id="news-heading"
          action={
            <Link href="/news" className="group flex items-center gap-2 index-num transition-colors hover:text-primary">
              ALL ENTRIES
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />
        <ul className="border-t" style={{ borderColor: "var(--border)" }}>
          {latestArticles.map((article, index) => (
            <li key={article.id} className="group border-b" style={{ borderColor: "var(--border)" }}>
              <Link href={`/news/${article.slug}`} className="flex items-start gap-5 py-5 transition-colors hover:bg-accent/40 sm:gap-8">
                <span className="index-num w-6 shrink-0 group-hover:text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <time dateTime={article.publishedAt.toISOString()} className="index-num hidden w-24 shrink-0 sm:block">
                  {dateFormatter.format(article.publishedAt)}
                </time>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium transition-colors group-hover:text-primary">
                    {article.title}
                  </span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">{article.summary}</span>
                </span>
                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 04 / FRIENDS */}
      <section data-section="friends" className="container pb-24 sm:pb-32">
        <SectionHeading number="04" label="Friendly Beacons" title="友链灯塔" id="links-heading" />
        <div className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 border-b pb-4 transition-colors hover:border-primary"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="index-num group-hover:text-primary">↗</span>
              <span>
                <span className="block text-sm font-medium group-hover:text-primary">{link.name}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{link.description}</span>
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
