import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="container flex flex-wrap items-center gap-x-6 gap-y-3 py-6 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">星舵</span>
        <span>{siteConfig.slogan}</span>
        <nav className="flex flex-wrap gap-x-4" aria-label="页脚导航">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}
          <Link href="/submit" className="transition-colors hover:text-primary">提交站点</Link>
        </nav>
        <span className="ml-auto index-num">© {new Date().getFullYear()} 星舵</span>
      </div>
    </footer>
  );
}
