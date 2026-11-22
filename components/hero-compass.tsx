"use client";

import Link from "next/link";
import type { MouseEvent } from "react";
import { useRef, useState } from "react";
import { CompassMark } from "./compass-mark";

const directions = [
  { label: "AI TOOLS", slug: "ai-tools", position: "left-0 top-1/2 -translate-y-1/2" },
  { label: "DESIGN", slug: "design", position: "left-1/2 top-0 -translate-x-1/2" },
  { label: "DEV", slug: "dev", position: "right-0 top-1/2 -translate-y-1/2" },
  { label: "LEARN", slug: "learning", position: "left-1/2 bottom-0 -translate-x-1/2" },
];

export function HeroCompass() {
  const ref = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(0);

  function onMove(event: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    setAngle((Math.atan2(y, x) * 180) / Math.PI + 90);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setAngle(0)}
      onClick={() =>
        window.dispatchEvent(new Event("star-rudder:random"))
      }
      className="group relative mx-auto hidden aspect-square w-[280px] shrink-0 cursor-pointer place-items-center lg:grid"
      role="button"
      tabIndex={0}
      aria-label="点击随机发现一个站点"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.dispatchEvent(new Event("star-rudder:random"));
        }
      }}
    >
      <div className="absolute inset-2 rounded-full border border-dashed opacity-50 transition-colors group-hover:border-primary/60" style={{ borderColor: "var(--border)" }} />
      <div className="absolute inset-8 rounded-full border opacity-60 transition-transform duration-500 group-hover:scale-105" style={{ borderColor: "var(--border)" }} />
      <CompassMark className="size-32 text-primary drop-shadow-[0_0_18px_color-mix(in_srgb,var(--primary)_18%,transparent)]" needleAngle={angle} />

      {directions.map((direction) => (
        <Link
          key={direction.slug}
          href={`/sites?category=${direction.slug}`}
          onClick={(event) => event.stopPropagation()}
          className={`absolute ${direction.position} border bg-background px-2 py-1 index-num transition-all hover:border-primary hover:text-primary hover:scale-105`}
          style={{ borderColor: "var(--border)" }}
        >
          {direction.label}
        </Link>
      ))}

      <span className="index-num absolute right-1 bottom-3 opacity-60 transition-opacity group-hover:opacity-0">
        N 00° / E 00°
      </span>
      <span className="index-num absolute right-1 bottom-3 text-primary opacity-0 transition-opacity group-hover:opacity-100">
        随机航向 ↗
      </span>
    </div>
  );
}
