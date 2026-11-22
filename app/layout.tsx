import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import { DevErrorFilter } from "@/components/dev-error-filter";
import { NewsTicker } from "@/components/news-ticker";
import { RandomDock } from "@/components/random-dock";
import { SiteChrome } from "@/components/site-chrome";
import { SiteFooter } from "@/components/site-footer";
import { getAllArticles, getAllSites } from "@/lib/queries";
import { createMetadata, JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  ...createMetadata({ title: siteConfig.name, description: siteConfig.description }),
  title: {
    default: `${siteConfig.name} ${siteConfig.nameEn} · ${siteConfig.slogan}`,
    template: `%s | ${siteConfig.name}`,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#141414" },
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allSites, allArticles] = await Promise.all([
    getAllSites(),
    getAllArticles(),
  ]);

  return (
    <html lang="zh-CN" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen">
        <DevErrorFilter />
        <JsonLd schema={[websiteJsonLd, organizationJsonLd]} />
        <SiteChrome
          searchData={{
            sites: allSites.map(({ name, slug, url, description }) => ({
              name,
              slug,
              url,
              description,
            })),
            articles: allArticles.map(({ title, slug, summary }) => ({
              title,
              slug,
              summary,
            })),
          }}
        />
        <div className="lg:pl-[232px]">
          <NewsTicker articles={allArticles.slice(0, 5).map(({ title, slug }) => ({ title, slug }))} />
          <main className="min-h-[70vh]">{children}</main>
          <SiteFooter />
        </div>
        <RandomDock sites={allSites.map(({ name, slug }) => ({ name, slug }))} />
      </body>
    </html>
  );
}
