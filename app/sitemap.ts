import type { MetadataRoute } from "next";
import { getAllArticles, getAllSites } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [sites, articles] = await Promise.all([getAllSites(), getAllArticles()]);
  const base = siteConfig.url.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/sites`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/news`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/links`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/submit`, changeFrequency: "monthly", priority: 0.3 },
  ];

  return [
    ...staticRoutes,
    ...articles.map((article) => ({
      url: `${base}/news/${article.slug}`,
      lastModified: article.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...sites.map((site) => ({
      url: `${base}/sites#${site.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
