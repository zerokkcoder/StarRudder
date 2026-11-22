import { and, desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";

const { sites, articles, categories, friendLinks } = schema;

export async function getFeaturedSites() {
  return db
    .select()
    .from(sites)
    .where(and(eq(sites.status, "active"), eq(sites.featured, true)))
    .orderBy(desc(sites.clicks))
    .limit(12);
}

export async function getAllSites() {
  return db
    .select()
    .from(sites)
    .where(eq(sites.status, "active"))
    .orderBy(desc(sites.clicks));
}

export async function getSiteCategories() {
  return db
    .select()
    .from(categories)
    .where(eq(categories.type, "site"))
    .orderBy(categories.sort);
}

export async function getLatestArticles(limit = 6) {
  return db
    .select()
    .from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function getArticleBySlug(slug: string) {
  const [article] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
    .limit(1);
  return article ?? null;
}

export async function getAllArticles() {
  return db
    .select()
    .from(articles)
    .where(eq(articles.status, "published"))
    .orderBy(desc(articles.publishedAt));
}

export async function getFriendLinks() {
  return db
    .select()
    .from(friendLinks)
    .where(eq(friendLinks.status, "active"))
    .orderBy(friendLinks.sort);
}
