"use server";

import { db } from "@/db";
import { submissions } from "@/db/schema";

export type SubmitState = { ok: boolean; message: string };

export async function submitLink(
  _prev: SubmitState,
  formData: FormData,
): Promise<SubmitState> {
  const type = String(formData.get("type") ?? "site");
  const name = String(formData.get("name") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!name || !url || !["site", "link"].includes(type)) {
    return { ok: false, message: "请填写名称、网址与提交类型。" };
  }

  try {
    new URL(url);
  } catch {
    return { ok: false, message: "网址格式不正确，请包含 https:// 前缀。" };
  }

  await db.insert(submissions).values({
    type,
    name,
    url,
    description,
    email: email || null,
  });

  return { ok: true, message: "提交成功！我们会在审核后收录。" };
}
