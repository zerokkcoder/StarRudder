"use client";

import { useActionState } from "react";
import { previewLink, saveImportedArticle, type ImportState } from "@/app/admin/articles/actions";
import { Button } from "@/components/ui/button";

const initial: ImportState = { ok: false, message: "" };

const fieldClass =
  "h-9 w-full rounded-none border bg-transparent px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";

export function LinkImportForm({
  categories,
}: {
  categories: { id: number; name: string }[];
}) {
  const [state, previewAction, pending] = useActionState(previewLink, initial);
  const preview = state.preview;

  return (
    <div className="mt-7 max-w-3xl space-y-8">
      <form action={previewAction} className="space-y-4">
        <div>
          <label htmlFor="url" className="index-num mb-2 block">内容链接</label>
          <input
            id="url"
            name="url"
            required
            placeholder="https://x.com/... · https://github.com/owner/repo · 任意文章链接"
            className={fieldClass}
            style={{ borderColor: "var(--border)" }}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            支持长文页面与 GitHub 开源库：自动提取标题、摘要与正文，抓取后仍可编辑再入库。
          </p>
        </div>
        <Button type="submit" loading={pending} className="rounded-none">抓取内容</Button>
      </form>

      {state.message && (
        <p className={state.ok ? "text-sm text-primary" : "text-sm text-destructive"}>
          {state.message}
        </p>
      )}

      {preview && (
        <form action={saveImportedArticle} className="space-y-5 border-t pt-7" style={{ borderColor: "var(--border)" }}>
          <input type="hidden" name="sourceUrl" value={preview.sourceUrl} />
          <input type="hidden" name="content" value={preview.content} />
          <div>
            <label htmlFor="title" className="index-num mb-2 block">标题</label>
            <input id="title" name="title" required defaultValue={preview.title} className={fieldClass} style={{ borderColor: "var(--border)" }} />
          </div>
          <div>
            <label htmlFor="summary" className="index-num mb-2 block">摘要</label>
            <input id="summary" name="summary" defaultValue={preview.summary} className={fieldClass} style={{ borderColor: "var(--border)" }} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="categoryId" className="index-num mb-2 block">所属分类</label>
              <select id="categoryId" name="categoryId" className={fieldClass} style={{ borderColor: "var(--border)" }}>
                <option value="">未分类</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="author" className="index-num mb-2 block">作者</label>
              <input id="author" name="author" defaultValue={preview.author} className={fieldClass} style={{ borderColor: "var(--border)" }} />
            </div>
          </div>
          <div>
            <p className="index-num mb-2 block">正文</p>
            <textarea
              name="content-preview"
              readOnly
              value={preview.content}
              rows={10}
              className={`${fieldClass} h-auto py-2 leading-6`}
              style={{ borderColor: "var(--border)" }}
            />
            <p className="mt-2 text-xs text-muted-foreground">正文以纯文本段落入库，页面会按空行分段展示。</p>
          </div>
          <Button type="submit" className="rounded-none">确认入库</Button>
        </form>
      )}
    </div>
  );
}
