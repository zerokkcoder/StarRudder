import type { Metadata } from "next";
import { SubmitForm } from "@/components/submit-form";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "提交站点",
  description: "向星舵提交优质站点或友情链接申请，审核通过后收录。",
  path: "/submit",
});

export default function SubmitPage() {
  return (
    <div className="container py-7 sm:py-9">
      <header className="border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-xl font-semibold tracking-tight">提交站点</h1>
        <p className="mt-1 text-xs text-muted-foreground">发现值得分享的好站？提交坐标，人工核对后收录。</p>
      </header>
      <SubmitForm />
    </div>
  );
}
