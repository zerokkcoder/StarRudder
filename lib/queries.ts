import { and, desc, eq, sql } from "drizzle-orm";
import { db, schema } from "@/db";

const { sites, articles, categories, friendLinks } = schema;

export async function getSiteBySlug(slug: string) {
  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.slug, slug), eq(sites.status, "active")))
    .limit(1);
  return site ?? null;
}

export async function incrementSiteClicks(id: number) {
  await db
    .update(sites)
    .set({ clicks: sql`${sites.clicks} + 1` })
    .where(eq(sites.id, id));
}

export async function getSitesByCategory(categorySlug?: string, query?: string) {
  const conditions = [eq(sites.status, "active")];
  if (categorySlug && categorySlug !== "all") {
    const [category] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1);
    if (category) conditions.push(eq(sites.categoryId, category.id));
  }
  if (query?.trim()) {
    const term = `%${query.trim().toLowerCase()}%`;
    conditions.push(sql`(lower(${sites.name}) like ${term} or lower(${sites.description}) like ${term})`);
  }
  return db
    .select()
    .from(sites)
    .where(and(...conditions))
    .orderBy(desc(sites.clicks));
}

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
