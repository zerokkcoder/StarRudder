import type { Metadata } from "next";
import { SubmitForm } from "@/components/submit-form";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "提交条目",
  description: "向星舵提交优质站点或友情链接申请，审核通过后收录。",
  path: "/submit",
});

export default function SubmitPage() {
  return (
    <div className="container py-14 sm:py-20">
      <header>
        <div className="flex items-center gap-3">
          <span className="index-num text-primary">05 / CONTRIBUTE</span>
          <span className="index-num uppercase tracking-[0.2em]">Send a signal</span>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">提交条目</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
          发现值得分享的好站？提交坐标，我们会人工核对后收录进相应方位。
        </p>
      </header>
      <SubmitForm />
    </div>
  );
}
