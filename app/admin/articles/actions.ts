"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db, schema } from "@/db";
import { importFromUrl, type ImportedContent } from "@/lib/content-import";

export type ImportState = {
  ok: boolean;
  message: string;
  preview?: ImportedContent;
};

export async function previewLink(
  _prev: ImportState,
  formData: FormData,
): Promise<ImportState> {
  const url = String(formData.get("url") ?? "").trim();
  if (!url) return { ok: false, message: "请填写链接地址" };
  try {
    const preview = await importFromUrl(url);
    return { ok: true, message: "抓取成功，请核对后入库", preview };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "抓取失败，请稍后重试",
    };
  }
}

function slugify(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `${base || "content"}-${Date.now().toString(36)}`;
}

export async function saveImportedArticle(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const sourceUrl = String(formData.get("sourceUrl") ?? "").trim();
  if (!title || !sourceUrl) return;

  const categoryRaw = String(formData.get("categoryId") ?? "").trim();
  const tags = String(formData.get("tags") ?? "")
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);

  await db.insert(schema.articles).values({
    title,
    slug: slugify(title),
    summary: String(formData.get("summary") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    categoryId: /^\d+$/.test(categoryRaw) ? Number(categoryRaw) : null,
    tags,
    source: "link",
    sourceUrl,
    publishedAt: new Date(),
  });

  revalidatePath("/news");
  revalidatePath("/");
  redirect("/admin/articles");
}
