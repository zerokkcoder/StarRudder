"use client";

import { useState } from "react";
import { createArticle } from "@/app/admin/actions";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function ArticleEditorForm() {
  const [content, setContent] = useState("");

  return (
    <form action={createArticle} className="mt-10 max-w-3xl space-y-6">
      <input type="hidden" name="content" value={content} />
      <div>
        <label htmlFor="title" className="index-num mb-2 block">标题</label>
        <Input id="title" name="title" required className="rounded-none" placeholder="文章标题" />
      </div>
      <div>
        <label htmlFor="summary" className="index-num mb-2 block">摘要</label>
        <Textarea id="summary" name="summary" rows={2} className="h-auto rounded-none" placeholder="一句话摘要" />
      </div>
      <div>
        <p className="index-num mb-2 block">正文</p>
        <TiptapEditor value={content} onChange={setContent} />
      </div>
      <Button type="submit" className="rounded-none">发布资讯</Button>
    </form>
  );
}
