import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, Newspaper, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getFeaturedSites, getFriendLinks, getLatestArticles } from "@/lib/queries";
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

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function HomePage() {
  const [featuredSites, latestArticles, links] = await Promise.all([
    getFeaturedSites(),
    getLatestArticles(),
    getFriendLinks(),
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

      {/* Hero：大留白，一句主张，一个动作 */}
      <section className="container pt-20 pb-16 sm:pt-28 sm:pb-24">
        <div className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-primary uppercase">
          <Compass className="size-3.5" />
          Star Rudder / 精选导航
        </div>
        <h1 className="mt-6 max-w-3xl text-balance text-4xl leading-[1.15] font-semibold tracking-[-0.03em] sm:text-6xl">
          在信息的海洋里，
          <br />
          找到值得停泊的<a className="text-primary">好站</a>。
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          {siteConfig.slogan}。我们只收录真正有用的工具与内容，少而精，每一条都值得收藏。
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button render={<Link href="/sites" />} size="lg">
            浏览站点导航
            <ArrowRight />
          </Button>
          <Button render={<Link href="/news" />} variant="outline" size="lg">
            看看最新资讯
          </Button>
        </div>
      </section>

      <div className="container">
        <Separator />
      </div>

      {/* 精选站点 */}
      <section className="container py-16 sm:py-20" aria-labelledby="featured-heading">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-primary uppercase">
              <Sparkles className="size-3.5" />
              Featured
            </div>
            <h2 id="featured-heading" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              精选站点
            </h2>
          </div>
          <Link
            href="/sites"
            className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            全部站点
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredSites.map((site) => (
            <a
              key={site.id}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-primary">
                      {site.name.slice(0, 1).toUpperCase()}
                    </div>
                    <ArrowUpRight className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <CardTitle className="mt-3 flex items-center gap-2 text-base">
                    {site.name}
                    <span className="text-xs font-normal text-muted-foreground">
                      {hostname(site.url)}
                    </span>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 leading-6">
                    {site.description}
                  </CardDescription>
                </CardHeader>
                {site.tags.length > 0 && (
                  <CardPanel className="flex flex-wrap gap-1.5 pt-0">
                    {site.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </CardPanel>
                )}
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* 最新资讯 */}
      <section className="container py-16 sm:py-20" aria-labelledby="news-heading">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-primary uppercase">
              <Newspaper className="size-3.5" />
              Journal
            </div>
            <h2 id="news-heading" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              最新资讯
            </h2>
          </div>
          <Link
            href="/news"
            className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            全部资讯
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <ul className="divide-y">
          {latestArticles.map((article) => (
            <li key={article.id}>
              <Link
                href={`/news/${article.slug}`}
                className="group flex flex-col gap-2 py-5 sm:flex-row sm:items-baseline sm:gap-8"
              >
                <time
                  dateTime={article.publishedAt.toISOString()}
                  className="shrink-0 text-xs tabular-nums text-muted-foreground sm:w-28"
                >
                  {dateFormatter.format(article.publishedAt)}
                </time>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-medium transition-colors group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                    {article.summary}
                  </p>
                </div>
                {article.source === "rss" && (
                  <Badge variant="outline" className="w-fit shrink-0 font-normal">
                    聚合
                  </Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 友情链接 */}
      <section className="container py-16 sm:py-20" aria-labelledby="links-heading">
        <div className="rounded-2xl border bg-card px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 id="links-heading" className="text-lg font-semibold tracking-tight">
                友情链接
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                和这些优秀的站点一起，探索更大的世界。
              </p>
            </div>
            <Button render={<Link href="/links" />} variant="ghost" size="sm">
              查看全部
              <ArrowRight />
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
