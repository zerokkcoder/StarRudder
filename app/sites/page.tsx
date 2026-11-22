import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllSites, getSiteCategories } from "@/lib/queries";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "站点导航",
  description: "星舵站点导航：精选 AI 工具、设计灵感、开发资源与效率工具，按分类快速发现好站。",
  path: "/sites",
});

export default async function SitesPage() {
  const [sites, categories] = await Promise.all([getAllSites(), getSiteCategories()]);

  return (
    <div className="container py-16 sm:py-20">
      <header className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">Directory</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">站点导航</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          按分类浏览，每一条都经过人工筛选。找不到想要的？欢迎<span className="text-foreground">提交站点</span>。
        </p>
      </header>

      <div className="mt-12 space-y-14">
        {categories.map((category) => {
          const group = sites.filter((site) => site.categoryId === category.id);
          if (group.length === 0) return null;
          return (
            <section key={category.id} aria-labelledby={`category-${category.slug}`}>
              <div className="flex items-baseline justify-between border-b pb-3">
                <h2 id={`category-${category.slug}`} className="text-lg font-semibold tracking-tight">
                  {category.name}
                </h2>
                <span className="text-xs text-muted-foreground">{group.length} 个站点</span>
              </div>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((site) => (
                  <li key={site.id}>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-semibold text-primary">
                        {site.name.slice(0, 1).toUpperCase()}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-1.5 text-sm font-medium">
                          {site.name}
                          <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                        </span>
                        <span className="mt-1 line-clamp-2 block text-xs leading-5 text-muted-foreground">
                          {site.description}
                        </span>
                        {site.tags.length > 0 && (
                          <span className="mt-2 flex flex-wrap gap-1">
                            {site.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-[10px] font-normal">
                                {tag}
                              </Badge>
                            ))}
                          </span>
                        )}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="mt-16 flex flex-wrap items-center gap-3 rounded-xl border bg-card p-6">
        <div className="flex-1">
          <h2 className="text-sm font-medium">没有找到你常去的站点？</h2>
          <p className="mt-1 text-xs text-muted-foreground">提交给我们，审核通过后会收录进导航。</p>
        </div>
        <Button render={<Link href="/submit" />} variant="outline" size="sm">
          提交站点
        </Button>
      </div>
    </div>
  );
}
