import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "@fontsource-variable/inter";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { DevErrorFilter } from "@/components/dev-error-filter";
import { getAllArticles, getAllSites } from "@/lib/queries";
import { createMetadata, JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  ...createMetadata({ title: siteConfig.name, description: siteConfig.description }),
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  title: {
    default: `${siteConfig.name} · ${siteConfig.slogan}`,
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
        <Script id="frontend-theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('star-rudder-theme');document.documentElement.classList.toggle('dark',t==='dark')}catch(e){document.documentElement.classList.remove('dark')}})();`}
        </Script>
        <DevErrorFilter />
        <JsonLd schema={[websiteJsonLd, organizationJsonLd]} />
        <AppShell
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
          randomSites={allSites.map(({ name, slug }) => ({ name, slug }))}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
