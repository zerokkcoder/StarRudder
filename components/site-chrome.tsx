"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";
import { CompassMark } from "./compass-mark";
import { SearchDialog } from "./search-dialog";
import { ThemeToggle } from "./theme-toggle";

type SearchData = {
  sites: { name: string; slug: string; url: string; description: string }[];
  articles: { title: string; slug: string; summary: string }[];
};

const sectionToHref: Record<string, string> = {
  hero: "/",
  featured: "/sites",
  journal: "/news",
  friends: "/links",
};

export function SiteChrome({ searchData }: { searchData: SearchData }) {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === "/" ? "hero" : pathname);

  useEffect(() => {
    if (pathname !== "/") {
      setActive(pathname);
      return;
    }
    const sections = document.querySelectorAll<HTMLElement>("[data-section]");
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          const id = visible[0].target.getAttribute("data-section");
          if (id && sectionToHref[id]) setActive(sectionToHref[id]);
        }
      },
      { rootMargin: "-30% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      {/* 桌面：左侧固定导航轨道 */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[232px] flex-col border-r px-6 py-8 lg:flex" style={{ borderColor: "var(--border)" }}>
        <Link href="/" className="flex items-center gap-3" aria-label="星舵首页">
          <span className="text-primary">
            <CompassMark className="size-8" />
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-tight">星舵</span>
            <span className="index-num block">STAR RUDDER</span>
          </span>
        </Link>

        <nav className="mt-16 flex flex-col gap-1" aria-label="主导航">
          {siteConfig.nav.map((item, index) => {
            const isActive = active === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-baseline gap-3 border-l-2 py-2 pl-3 text-sm transition-colors ${
                  isActive ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className={`index-num ${isActive ? "text-primary" : ""}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <SearchDialog
            {...searchData}
            triggerClassName="flex w-full items-center gap-2 border px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            trigger={
              <>
                <Search className="size-3.5" />
                <span className="flex-1">索引检索</span>
                <span className="index-num">⌘K</span>
              </>
            }
          />
          <div className="flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <span className="index-num">© 2026 STAR RUDDER</span>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* 移动端：顶部细条 */}
      <div className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur lg:hidden" style={{ borderColor: "var(--border)" }}>
        <div className="flex h-14 items-center gap-3 px-5">
          <Link href="/" className="flex items-center gap-2 text-primary" aria-label="星舵首页">
            <CompassMark className="size-6" />
            <span className="text-sm font-semibold text-foreground">星舵</span>
          </Link>
          <div className="ml-auto flex items-center gap-1">
            <SearchDialog
              {...searchData}
              triggerClassName="flex size-8 items-center justify-center text-muted-foreground hover:text-primary"
              trigger={<Search className="size-4" />}
            />
            <ThemeToggle />
          </div>
        </div>
        <nav className="flex gap-5 overflow-x-auto px-5 pb-3" aria-label="主导航">
          {siteConfig.nav.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-baseline gap-1.5 text-xs ${
                active === item.href ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <span className="index-num">{String(index + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
