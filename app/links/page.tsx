import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFriendLinks } from "@/lib/queries";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "友链灯塔",
  description: "星舵友情链接：与优秀站点一起，探索更大的世界。",
  path: "/links",
});

export default async function LinksPage() {
  const links = await getFriendLinks();

  return (
    <div className="container py-14 sm:py-20">
      <header>
        <div className="flex items-center gap-3">
          <span className="index-num text-primary">04 / BEACONS</span>
          <span className="index-num uppercase tracking-[0.2em]">Friendly signals</span>
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">友链灯塔</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">
          同类相吸，这些站点也值得收藏。欢迎提交友链互换申请。
        </p>
      </header>

      <ul className="mt-12 grid gap-x-12 gap-y-8 sm:grid-cols-2">
        {links.map((link, index) => (
          <li key={link.id} className="group border-b pb-5" style={{ borderColor: "var(--border)" }}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4">
              <span className="index-num w-6 shrink-0 group-hover:text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="flex items-center gap-2 text-sm font-medium group-hover:text-primary">
                  {link.name} <span className="index-num">↗</span>
                </span>
                <span className="mt-2 block text-xs leading-6 text-muted-foreground">
                  {link.description}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-16 flex flex-wrap items-center gap-4 border-t pt-8" style={{ borderColor: "var(--border)" }}>
        <p className="flex-1 text-xs text-muted-foreground">想让你的站点出现在这里？</p>
        <Link href="/submit" className="flex items-center gap-2 index-num transition-colors hover:text-primary">
          提交友链申请 <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}
