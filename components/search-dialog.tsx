"use client";

import Link from "next/link";
import { ArrowUpRight, FileText, Globe2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

type SearchItem = {
  kind: "site" | "article";
  title: string;
  description: string;
  href: string;
  external?: boolean;
};

export function SearchDialog({
  sites,
  articles,
}: {
  sites: { name: string; slug: string; url: string; description: string }[];
  articles: { title: string; slug: string; summary: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const items = useMemo<SearchItem[]>(() => {
    const all: SearchItem[] = [
      ...sites.map((site) => ({
        kind: "site" as const,
        title: site.name,
        description: site.description,
        href: site.url,
        external: true,
      })),
      ...articles.map((article) => ({
        kind: "article" as const,
        title: article.title,
        description: article.summary,
        href: `/news/${article.slug}`,
      })),
    ];
    const term = query.trim().toLowerCase();
    if (!term) return all.slice(0, 8);
    return all
      .filter(
        (item) =>
          item.title.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term),
      )
      .slice(0, 10);
  }, [sites, articles, query]);

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="h-9 w-full justify-start gap-2 rounded-lg px-3 text-muted-foreground sm:w-64"
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">搜索站点与资讯…</span>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPopup className="max-w-xl p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>全站搜索</DialogTitle>
            <DialogDescription>搜索站点与资讯</DialogDescription>
          </DialogHeader>
          <div className="p-2">
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索站点、工具、资讯…"
              className="border-transparent shadow-none"
            />
          </div>
          <div className="max-h-96 overflow-y-auto border-t px-2 py-2">
            {items.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                没有找到相关内容
              </p>
            ) : (
              <ul className="space-y-1">
                {items.map((item) => {
                  const Icon = item.kind === "site" ? Globe2 : FileText;
                  const content = (
                    <>
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {item.title}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {item.description}
                        </span>
                      </span>
                      {item.external && (
                        <ArrowUpRight className="size-4 text-muted-foreground" />
                      )}
                    </>
                  );
                  const className =
                    "flex items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-accent";
                  return (
                    <li key={`${item.kind}-${item.href}`}>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={className}
                          onClick={() => setOpen(false)}
                        >
                          {content}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className={className}
                          onClick={() => setOpen(false)}
                        >
                          {content}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </DialogPopup>
      </Dialog>
    </>
  );
}
