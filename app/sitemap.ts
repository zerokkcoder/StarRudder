import type { MetadataRoute } from "next";
import { getAllArticles, getAllSites } from "@/lib/queries";
import { siteConfig } from "@/lib/site";

// 每次请求都查库生成，避免构建时数据库为空导致站点地图只有静态路由
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/sites`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/news`, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/links`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/submit`, changeFrequency: "monthly", priority: 0.3 },
  ];

  let sites: Awaited<ReturnType<typeof getAllSites>> = [];
  let articles: Awaited<ReturnType<typeof getAllArticles>> = [];
  try {
    [sites, articles] = await Promise.all([getAllSites(), getAllArticles()]);
  } catch (error) {
    // 数据库暂时不可用时仍返回静态路由，避免站点地图 500
    console.error("[sitemap] 数据库查询失败", error);
  }

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
