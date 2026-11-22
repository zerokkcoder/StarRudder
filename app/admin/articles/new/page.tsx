import type { Metadata } from "next";
import { ArticleEditorForm } from "@/components/article-editor-form";

export const metadata: Metadata = {
  title: "新建资讯",
  robots: { index: false, follow: false },
};

export default function NewArticlePage() {
  return (
    <div className="container py-14 sm:py-20">
      <header>
        <p className="index-num text-primary">后台 / 新建资讯</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">新建资讯</h1>
        <p className="mt-2 text-xs text-muted-foreground">使用 Tiptap 编辑器撰写原创全文内容。</p>
      </header>
      <ArticleEditorForm />
    </div>
  );
}
