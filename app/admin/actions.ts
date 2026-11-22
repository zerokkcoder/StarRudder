"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/auth";
import { db, schema } from "@/db";

function slugify(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return `${base || "entry"}-${Date.now().toString(36)}`;
}

export async function approveSubmission(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;

  const [submission] = await db
    .select()
    .from(schema.submissions)
    .where(eq(schema.submissions.id, id))
    .limit(1);
  if (!submission || submission.status !== "pending") return;

  if (submission.type === "link") {
    await db.insert(schema.friendLinks).values({
      name: submission.name,
      url: submission.url,
      description: submission.description || "来自社区推荐的友好站点。",
      status: "active",
      sort: 99,
    });
    revalidatePath("/links");
  } else {
    const [category] = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.type, "site"))
      .limit(1);
    await db.insert(schema.sites).values({
      name: submission.name,
      slug: slugify(submission.name),
      url: submission.url,
      description: submission.description,
      categoryId: category?.id ?? null,
      tags: [],
      status: "active",
    });
    revalidatePath("/sites");
  }

  await db
    .update(schema.submissions)
    .set({ status: "approved" })
    .where(eq(schema.submissions.id, id));
  revalidatePath("/admin/submissions");
}

export async function createArticle(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  if (!title) return;

  const [newsCategory] = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.type, "news"))
    .limit(1);

  await db.insert(schema.articles).values({
    title,
    slug: slugify(title),
    summary,
    content,
    categoryId: newsCategory?.id ?? null,
    tags: [],
    source: "manual",
    status: "published",
  });

  revalidatePath("/news");
  redirect("/news");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}

export async function rejectSubmission(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await db
    .update(schema.submissions)
    .set({ status: "rejected" })
    .where(eq(schema.submissions.id, id));
  revalidatePath("/admin/submissions");
}
