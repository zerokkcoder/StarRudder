import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { SearchDialog } from "./search-dialog";
import { ThemeToggle } from "./theme-toggle";

type SearchData = {
  sites: { name: string; slug: string; url: string; description: string }[];
  articles: { title: string; slug: string; summary: string }[];
};

export function SiteHeader({ searchData }: { searchData: SearchData }) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="container flex h-16 items-center gap-6">
        <Link href="/" className="group flex items-center gap-2.5" aria-label="星舵首页">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="size-[18px]"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9 4.9-2.1Z" fill="currentColor" stroke="none" />
            </svg>
          </span>
          <span className="text-[17px] font-semibold tracking-tight">
            {siteConfig.name}
            <span className="ml-1.5 hidden text-xs font-normal text-muted-foreground sm:inline">
              StarRudder
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SearchDialog {...searchData} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
