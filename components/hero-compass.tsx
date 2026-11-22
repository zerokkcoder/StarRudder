import Link from "next/link";
import { CompassMark } from "./compass-mark";

const directions = [
  { label: "AI TOOLS", slug: "ai-tools", position: "left-0 top-1/2 -translate-y-1/2" },
  { label: "DESIGN", slug: "design", position: "left-1/2 top-0 -translate-x-1/2" },
  { label: "DEV", slug: "dev", position: "right-0 top-1/2 -translate-y-1/2" },
  { label: "LEARN", slug: "learning", position: "left-1/2 bottom-0 -translate-x-1/2" },
];

export function HeroCompass() {
  return (
    <div className="relative mx-auto hidden aspect-square w-[248px] shrink-0 place-items-center lg:grid">
      <div className="absolute inset-4 rounded-full border opacity-60" style={{ borderColor: "var(--border)" }} />
      <div className="absolute inset-10 rounded-full border border-dashed opacity-50" style={{ borderColor: "var(--border)" }} />
      <CompassMark className="size-28 text-primary" spin />

      {directions.map((direction) => (
        <Link
          key={direction.slug}
          href={`/sites?category=${direction.slug}`}
          className={`absolute ${direction.position} index-num border bg-background px-2 py-1 transition-colors hover:border-primary hover:text-primary`}
          style={{ borderColor: "var(--border)" }}
        >
          {direction.label}
        </Link>
      ))}

      <span className="absolute bottom-5 right-1 index-num opacity-60">N 00° / E 00°</span>
    </div>
  );
}
