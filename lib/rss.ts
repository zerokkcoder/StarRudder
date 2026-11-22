import { and, eq, isNull, or, sql } from "drizzle-orm";
import Parser from "rss-parser";
import { db, schema } from "../db";
import { extractPageText, htmlToParagraphs } from "./content-import";

const parser = new Parser({
  timeout: 12000,
  headers: { "User-Agent": "StarRudder RSS Reader/1.0 (+https://starrudder.cc)" },
});

function stripHtml(input: string) {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .replace(/[\u{10000}-\u{10FFFF}]/gu, "")
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

function feedContent(item: Record<string, unknown>) {
  const raw = String(item["content:encoded"] ?? item.content ?? "");
  if (!raw) return "";
  return htmlToParagraphs(raw);
}

export type RssFetchResult = {
  sources: number;
  added: number;
  errors: { name: string; message: string }[];
};

/** 抓取订阅源：优先用 feed 自带全文，不足时回源抓取网页正文，去重后入库 */
export async function fetchRssFeeds(): Promise<RssFetchResult> {
  const sources = await db
    .select()
    .from(schema.rssSources)
    .where(eq(schema.rssSources.status, "active"));

  const result: RssFetchResult = { sources: sources.length, added: 0, errors: [] };

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      for (const [index, item] of feed.items.slice(0, 12).entries()) {
        const link = item.link ?? item.guid;
        const title = item.title?.replace(/[\u{10000}-\u{10FFFF}]/gu, "").trim();
        if (!link || !title) continue;

        const exists = await db
          .select({ id: schema.articles.id })
          .from(schema.articles)
          .where(eq(schema.articles.sourceUrl, link))
          .limit(1);
        if (exists.length > 0) continue;

        const summary = stripHtml(item.contentSnippet ?? item.content ?? "").slice(0, 220);
        let content = feedContent(item as unknown as Record<string, unknown>);
        if (content.length < 300 && index < 8) {
          content = await extractPageText(link, 8000).catch(() => "");
        }

        await db.insert(schema.articles).values({
          title,
          slug: makeSlug(title),
          summary: summary || content.slice(0, 220) || `来自 ${source.name} 的最新条目，点击阅读原文。`,
          content,
          categoryId: source.categoryId,
          tags: ["RSS", source.name],
          source: "rss",
          sourceUrl: link,
          publishedAt: item.isoDate ? new Date(item.isoDate) : new Date(),
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

/** 为历史聚合条目补全正文（只处理内容为空或过短的条目） */
export async function backfillRssContent() {
  const rows = await db
    .select({ id: schema.articles.id, sourceUrl: schema.articles.sourceUrl })
    .from(schema.articles)
    .where(
      and(
        eq(schema.articles.source, "rss"),
        or(isNull(schema.articles.content), sql`length(${schema.articles.content}) < 300`),
      ),
    );

  let filled = 0;
  for (const row of rows) {
    if (!row.sourceUrl) continue;
    const content = await extractPageText(row.sourceUrl, 8000).catch(() => "");
    if (content.length >= 100) {
      await db
        .update(schema.articles)
        .set({ content })
        .where(eq(schema.articles.id, row.id));
      filled += 1;
    }
  }
  return { total: rows.length, filled };
}
