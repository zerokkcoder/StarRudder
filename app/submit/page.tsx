import type { Metadata } from "next";
import { SubmitForm } from "@/components/submit-form";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "提交站点 / 友链",
  description: "向星舵提交优质站点或友情链接申请，审核通过后收录。",
  path: "/submit",
});

export default function SubmitPage() {
  return (
    <div className="container py-16 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">Contribute</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">提交站点</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          发现值得分享的好站？提交给我们，审核通过后会收录进相应分类。
        </p>
      </header>
      <SubmitForm />
    </div>
  );
}
