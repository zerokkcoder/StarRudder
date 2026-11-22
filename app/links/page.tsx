import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="container py-16 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">Friends</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">友情链接</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          同类相吸，这些站点也值得你收藏。欢迎通过提交页面申请友链互换。
        </p>
      </header>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {links.map((link) => (
          <li key={link.id}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-start justify-between gap-4 rounded-xl border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <div>
                <h2 className="flex items-center gap-1.5 text-sm font-medium">
                  {link.name}
                  <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{link.description}</p>
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-14 flex flex-wrap items-center gap-3 rounded-xl border bg-card p-6">
        <p className="flex-1 text-sm text-muted-foreground">想让你的站点出现在这里？</p>
        <Button render={<Link href="/submit" />} variant="outline" size="sm">
          提交友链申请
        </Button>
      </div>
    </div>
  );
}
