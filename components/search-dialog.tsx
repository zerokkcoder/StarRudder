"use client";

import Link from "next/link";
import { ArrowUpRight, FileText, Globe2, Search } from "lucide-react";
import type { ReactNode } from "react";
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
  trigger,
  triggerClassName,
}: {
  sites: { name: string; slug: string; url: string; description: string }[];
  articles: { title: string; slug: string; summary: string }[];
  trigger?: ReactNode;
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setActiveIndex(0), [query, open]);

  function highlight(text: string) {
    const term = query.trim();
    if (!term) return text;
    const at = text.toLowerCase().indexOf(term.toLowerCase());
    if (at < 0) return text;
    return (
      <>
        {text.slice(0, at)}
        <mark className="bg-primary/15 text-primary">{text.slice(at, at + term.length)}</mark>
        {text.slice(at + term.length)}
      </>
    );
  }

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
      {trigger ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={triggerClassName}
          aria-label="打开全站搜索"
        >
          {trigger}
        </button>
      ) : (
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="h-9 w-full justify-start gap-2 px-3 text-muted-foreground sm:w-64"
        >
          <Search className="size-4" />
          <span className="flex-1 text-left">搜索站点与资讯…</span>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </Button>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogPopup className="max-w-xl p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>全站搜索</DialogTitle>
            <DialogDescription>搜索站点与资讯</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 border-b px-4 py-3">
            <span className="index-num">站内检索</span>
            <span className="ml-auto index-num">⌘K</span>
          </div>
          <div className="p-2">
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setActiveIndex((i) => Math.min(i + 1, items.length - 1));
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setActiveIndex((i) => Math.max(i - 1, 0));
                } else if (event.key === "Enter" && items[activeIndex]) {
                  event.preventDefault();
                  const item = items[activeIndex];
                  if (item.external) window.open(item.href, "_blank", "noopener,noreferrer");
                  else window.location.href = item.href;
                  setOpen(false);
                }
              }}
              placeholder="搜索站点、工具、资讯…"
              className="border-transparent rounded-none shadow-none px-2"
            />
          </div>
          <div className="max-h-96 overflow-y-auto border-t px-2 py-2">
            {items.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                没有找到相关内容
              </p>
            ) : (
              <ul className="space-y-1">
                {items.map((item, index) => {
                  const Icon = item.kind === "site" ? Globe2 : FileText;
                  const active = index === activeIndex;
                  const content = (
                    <>
                      <span className={`index-num w-5 shrink-0 ${active ? "text-primary" : ""}`}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className={`flex size-7 shrink-0 items-center justify-center border ${active ? "border-primary text-primary" : "text-muted-foreground"}`}>
                        <Icon className="size-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {highlight(item.title)}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {highlight(item.description)}
                        </span>
                      </span>
                      {item.external && (
                        <ArrowUpRight className="size-3.5 text-muted-foreground" />
                      )}
                    </>
                  );
                  const className = `flex items-center gap-3 px-2.5 py-2 text-left transition-colors group ${
                    active ? "bg-accent/80" : "hover:bg-accent/40"
                  }`;
                  return (
                    <li
                      key={`${item.kind}-${item.href}`}
                      className="animate-row-in"
                      style={{ animationDelay: `${Math.min(index * 24, 240)}ms` }}
                      onMouseEnter={() => setActiveIndex(index)}
                    >
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
