import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t" style={{ borderColor: "var(--border)" }}>
      <div className="container flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="index-num text-primary">COLOPHON / 版本记录</p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            星舵是一份持续修订的好站索引。收录标准只有一条：它是否值得你再次打开。
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground" aria-label="页脚导航">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
              {item.label}
            </Link>
          ))}
          <Link href="/submit" className="transition-colors hover:text-primary">
            提交站点
          </Link>
        </nav>
        <div className="index-num space-y-1 text-right">
          <p>INDEXED {new Date().getFullYear()}</p>
          <p>41°24&apos;N / 2°10&apos;E</p>
        </div>
      </div>
    </footer>
  );
}
