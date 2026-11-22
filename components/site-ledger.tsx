import { ArrowUpRight } from "lucide-react";
import type { Site } from "@/db/schema";

export function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function SiteLedger({ sites }: { sites: Site[] }) {
  if (sites.length === 0) {
    return (
      <p className="border py-16 text-center text-sm text-muted-foreground" style={{ borderColor: "var(--border)" }}>
        该航向暂无收录条目。
      </p>
    );
  }

  return (
    <ul className="border-t" style={{ borderColor: "var(--border)" }}>
      {sites.map((site, index) => (
        <li key={site.id} className="group border-b" style={{ borderColor: "var(--border)" }}>
          <a
            href={`/go/${site.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 py-4 transition-colors hover:bg-accent/40 sm:gap-6"
          >
            <span className="index-num w-6 shrink-0 group-hover:text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flex size-9 shrink-0 items-center justify-center border font-mono text-sm text-primary transition-colors group-hover:border-primary">
              {site.name.slice(0, 1).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                <span className="text-sm font-medium transition-colors group-hover:text-primary">
                  {site.name}
                </span>
                <span className="index-num">{hostname(site.url)}</span>
              </span>
              <span className="mt-1 block truncate text-xs text-muted-foreground">
                {site.description}
              </span>
            </span>
            <span className="hidden shrink-0 items-center gap-1.5 md:flex">
              {site.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="index-num border px-1.5 py-0.5" style={{ borderColor: "var(--border)" }}>
                  {tag}
                </span>
              ))}
            </span>
            <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-primary" />
          </a>
        </li>
      ))}
    </ul>
  );
}
