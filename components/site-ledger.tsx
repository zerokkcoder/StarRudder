"use client";

import { ArrowUpRight } from "lucide-react";
import type { MouseEvent } from "react";
import type { Site } from "@/db/schema";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";

export function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function SiteLedger({ sites }: { sites: Site[] }) {
  function spotlight(event: MouseEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  if (sites.length === 0) {
    return (
      <p className="border py-14 text-center text-sm text-muted-foreground" style={{ borderColor: "var(--border)" }}>
        该航向暂无收录条目。
      </p>
    );
  }

  return (
    <ul className="grid gap-2 pt-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {sites.map((site, index) => (
        <li
          key={site.id}
          className="group animate-row-in"
          style={{ animationDelay: `${Math.min(index * 18, 220)}ms` }}
        >
          <a
            href={`/go/${site.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={spotlight}
            className="spotlight block h-full rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <Card className="h-full rounded-lg transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-primary/40">
              <CardHeader className="flex-1 p-3 pb-2">
                <div className="flex items-start justify-end">
                  <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-primary" />
                </div>
                <div className="-mt-4 flex items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center border border-input font-mono text-xs text-primary transition-colors group-hover:border-primary">
                    {site.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <CardTitle className="truncate text-[13px]">{site.name}</CardTitle>
                    <span className="index-num block truncate text-[10px]">{hostname(site.url)}</span>
                  </span>
                </div>
                <CardDescription className="mt-2 line-clamp-2 min-h-[32px] text-[11px] leading-4">
                  {site.description}
                </CardDescription>
              </CardHeader>
              <CardPanel className="mt-auto flex flex-wrap gap-1 px-3 pb-3 pt-0">
                {site.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="px-1.5 py-0 text-[10px] font-normal">
                    {tag}
                  </Badge>
                ))}
              </CardPanel>
            </Card>
          </a>
        </li>
      ))}
    </ul>
  );
}
