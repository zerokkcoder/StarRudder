import { eq } from "drizzle-orm";
import Parser from "rss-parser";
import { db, schema } from "../db";

const parser = new Parser({
  timeout: 12000,
  headers: { "User-Agent": "StarRudder RSS Reader/1.0 (+https://github.com/zerokkcoder/StarRudder)" },
});

function stripHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function makeSlug(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "signal"}-${Date.now().toString(36)}`;
}

export type RssFetchResult = {
  sources: number;
  added: number;
  errors: { name: string; message: string }[];
};

/** 抓取所有启用中的 RSS 源，仅沉淀摘要 + 原文链接，按 sourceUrl 去重 */
export async function fetchRssFeeds(): Promise<RssFetchResult> {
  const sources = await db
    .select()
    .from(schema.rssSources)
    .where(eq(schema.rssSources.status, "active"));

  const result: RssFetchResult = { sources: sources.length, added: 0, errors: [] };

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      for (const item of feed.items.slice(0, 12)) {
        const link = item.link ?? item.guid;
        const title = item.title?.trim();
        if (!link || !title) continue;

        const exists = await db
          .select({ id: schema.articles.id })
          .from(schema.articles)
          .where(eq(schema.articles.sourceUrl, link))
          .limit(1);
        if (exists.length > 0) continue;

        const summary = stripHtml(item.contentSnippet ?? item.content ?? "").slice(0, 220);
        const publishedAt = item.isoDate ? new Date(item.isoDate) : new Date();

        await db.insert(schema.articles).values({
          title,
          slug: makeSlug(title),
          summary: summary || `来自 ${source.name} 的最新条目，点击阅读原文。`,
          content: "",
          categoryId: source.categoryId,
          tags: ["RSS", source.name],
          source: "rss",
          sourceUrl: link,
          publishedAt,
          status: "published",
        });
        result.added += 1;
      }

      await db
        .update(schema.rssSources)
        .set({ lastFetchedAt: new Date() })
        .where(eq(schema.rssSources.id, source.id));
    } catch (error) {
      result.errors.push({
        name: source.name,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return result;
}
