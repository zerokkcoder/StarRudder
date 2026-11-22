"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { fetchRssFeeds } from "@/lib/rss";

function idOf(value: FormDataEntryValue | null) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function textOf(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function slugify(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return `${base || "entry"}-${Date.now().toString(36)}`;
}

/* ---------- 站点 ---------- */

export async function createSite(formData: FormData) {
  const name = textOf(formData.get("name"));
  const url = textOf(formData.get("url"));
  if (!name || !url) return;
  await db.insert(schema.sites).values({
    name,
    slug: textOf(formData.get("slug")) || slugify(name),
    url,
    description: textOf(formData.get("description")),
    categoryId: idOf(formData.get("categoryId")),
    tags: textOf(formData.get("tags")).split(/[,，]/).map((t) => t.trim()).filter(Boolean),
    featured: formData.get("featured") === "on",
    status: textOf(formData.get("status")) || "active",
  });
  revalidatePath("/sites");
  revalidatePath("/");
  redirect("/admin/sites");
}

export async function updateSite(formData: FormData) {
  const id = idOf(formData.get("id"));
  if (!id) return;
  await db
    .update(schema.sites)
    .set({
      name: textOf(formData.get("name")),
      slug: textOf(formData.get("slug")),
      url: textOf(formData.get("url")),
      description: textOf(formData.get("description")),
      categoryId: idOf(formData.get("categoryId")),
      tags: textOf(formData.get("tags")).split(/[,，]/).map((t) => t.trim()).filter(Boolean),
      featured: formData.get("featured") === "on",
      status: textOf(formData.get("status")) || "active",
    })
    .where(eq(schema.sites.id, id));
  revalidatePath("/sites");
  revalidatePath("/");
  redirect("/admin/sites");
}

export async function deleteSite(formData: FormData) {
  const id = idOf(formData.get("id"));
  if (!id) return;
  await db.delete(schema.sites).where(eq(schema.sites.id, id));
  revalidatePath("/sites");
  revalidatePath("/");
}

/* ---------- 分类 ---------- */

export async function createCategory(formData: FormData) {
  const name = textOf(formData.get("name"));
  if (!name) return;
  await db.insert(schema.categories).values({
    name,
    slug: textOf(formData.get("slug")) || slugify(name),
    icon: textOf(formData.get("icon")) || null,
    type: textOf(formData.get("type")) || "site",
    sort: Number(formData.get("sort")) || 0,
  });
  revalidatePath("/sites");
  revalidatePath("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  const id = idOf(formData.get("id"));
  if (!id) return;
  await db.delete(schema.categories).where(eq(schema.categories.id, id));
  revalidatePath("/sites");
  revalidatePath("/admin/categories");
}

/* ---------- 资讯 ---------- */

export async function deleteArticle(formData: FormData) {
  const id = idOf(formData.get("id"));
  if (!id) return;
  await db.delete(schema.articles).where(eq(schema.articles.id, id));
  revalidatePath("/news");
  revalidatePath("/");
}

/* ---------- 订阅源 ---------- */

export async function createRssSource(formData: FormData) {
  const name = textOf(formData.get("name"));
  const url = textOf(formData.get("url"));
  if (!name || !url) return;
  await db.insert(schema.rssSources).values({
    name,
    url,
    categoryId: idOf(formData.get("categoryId")),
  });
  revalidatePath("/admin/rss-sources");
}

export async function deleteRssSource(formData: FormData) {
  const id = idOf(formData.get("id"));
  if (!id) return;
  await db.delete(schema.rssSources).where(eq(schema.rssSources.id, id));
  revalidatePath("/admin/rss-sources");
}

export async function fetchRssNow() {
  await fetchRssFeeds();
  revalidatePath("/news");
  revalidatePath("/");
}

/* ---------- 友情链接 ---------- */

export async function createFriendLink(formData: FormData) {
  const name = textOf(formData.get("name"));
  const url = textOf(formData.get("url"));
  if (!name || !url) return;
  await db.insert(schema.friendLinks).values({
    name,
    url,
    description: textOf(formData.get("description")),
    sort: Number(formData.get("sort")) || 0,
  });
  revalidatePath("/links");
  revalidatePath("/");
}

export async function deleteFriendLink(formData: FormData) {
  const id = idOf(formData.get("id"));
  if (!id) return;
  await db.delete(schema.friendLinks).where(eq(schema.friendLinks.id, id));
  revalidatePath("/links");
  revalidatePath("/");
}
