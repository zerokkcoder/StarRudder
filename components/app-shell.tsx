"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { RandomDock } from "./random-dock";
import { SiteChrome } from "./site-chrome";
import { SiteFooter } from "./site-footer";

type SearchData = {
  sites: { name: string; slug: string; url: string; description: string }[];
  articles: { title: string; slug: string; summary: string }[];
};

export function AppShell({
  children,
  searchData,
  randomSites,
}: {
  children: ReactNode;
  searchData: SearchData;
  randomSites: { name: string; slug: string }[];
}) {
  const pathname = usePathname();
  const isBackend = pathname.startsWith("/admin") || pathname === "/login";

  return (
    <>
      {!isBackend && <SiteChrome searchData={searchData} />}
      <div className={isBackend ? "" : "lg:pl-[176px]"}>
        <main className={isBackend ? "" : "min-h-[70vh]"}>{children}</main>
        {!isBackend && <SiteFooter />}
      </div>
      {!isBackend && <RandomDock sites={randomSites} />}
    </>
  );
}
