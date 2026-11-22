"use client";

import { Shuffle } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CompassMark } from "./compass-mark";

type Pick = { name: string; slug: string };

export function RandomDock({ sites }: { sites: Pick[] }) {
  const [pick, setPick] = useState<Pick | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const picksRef = useRef(sites);
  picksRef.current = sites;

  const launch = useCallback(
    (fromGesture: boolean) => {
      const list = picksRef.current;
      if (list.length === 0) return;
      const next = list[Math.floor(Math.random() * list.length)];
      setPick(next);

      const go = () => {
        const url = `/go/${next.slug}`;
        // 带 noopener 时 window.open 在部分浏览器返回 null，会被误判为拦截并导致当前页跳转
        const win = window.open(url, "_blank");
        if (win) {
          win.opener = null;
        } else if (!fromGesture) {
          // 非用户手势触发且弹窗被拦截时，才退回当前页打开
          window.location.href = url;
        }
        setPick(null);
      };

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(go, reduced ? 0 : 950);
    },
    [],
  );

  useEffect(() => {
    const onRandom = () => launch(false);
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (event.key.toLowerCase() === "r" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        launch(true);
      }
    };
    window.addEventListener("star-rudder:random", onRandom);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("star-rudder:random", onRandom);
      window.removeEventListener("keydown", onKey);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [launch]);

  return (
    <>
      <button
        type="button"
        onClick={() => launch(true)}
        className="fixed right-5 bottom-[88px] z-50 flex items-center gap-2 border bg-background px-3 py-2.5 text-xs shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary lg:right-8 lg:bottom-[88px]"
        style={{ borderColor: "var(--border)" }}
        aria-label="随机发现一个站点"
      >
        <Shuffle className="size-3.5" />
        <span>随机发现</span>
        <kbd className="index-num border px-1" style={{ borderColor: "var(--border)" }}>R</kbd>
      </button>

      {pick && (
        <div className="route-sweep fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background">
          <CompassMark className="size-24 text-primary" spin />
          <p className="index-num mt-8 text-primary">正在定位航线</p>
          <p className="mt-4 text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            正在前往 {pick.name}
          </p>
          <div className="mt-8 h-px w-48 overflow-hidden bg-muted">
            <div className="h-full w-1/3 animate-[marquee_0.9s_linear_infinite] bg-primary" />
          </div>
        </div>
      )}
    </>
  );
}
