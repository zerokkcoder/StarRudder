import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFriendLinks } from "@/lib/queries";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "友情链接",
  description: "星舵友情链接：与优秀站点一起，探索更大的世界。",
  path: "/links",
});

export default async function LinksPage() {
  const links = await getFriendLinks();

  return (
    <div className="container py-7 sm:py-9">
      <header className="border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-xl font-semibold tracking-tight">友情链接</h1>
        <p className="mt-1 text-xs text-muted-foreground">同类相吸，这些站点也值得收藏。</p>
      </header>

      <ul className="grid gap-x-8 sm:grid-cols-2">
        {links.map((link, index) => (
          <li key={link.id} className="group">
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 border-b py-2.5 transition-colors hover:text-primary" style={{ borderColor: "var(--border)" }}>
              <span className="index-num w-5 shrink-0 group-hover:text-primary">{String(index + 1).padStart(2, "0")}</span>
              <span className="shrink-0 text-[13px] font-medium">{link.name}</span>
              <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{link.description}</span>
              <span className="index-num">↗</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap items-center gap-3 border-t py-5" style={{ borderColor: "var(--border)" }}>
        <p className="flex-1 text-xs text-muted-foreground">想让你的站点出现在这里？</p>
        <Link href="/submit?type=link" className="flex items-center gap-1 index-num transition-colors hover:text-primary">
          提交友链申请 <ArrowRight className="size-3" />
        </Link>
      </div>
    </div>
  );
}
