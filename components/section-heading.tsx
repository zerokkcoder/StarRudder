import type { ReactNode } from "react";

export function SectionHeading({
  number,
  label,
  title,
  id,
  action,
}: {
  number: string;
  label: string;
  title: string;
  id?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-6 border-b pb-3" style={{ borderColor: "var(--border)" }}>
      <div>
        <div className="flex items-center gap-3">
          <span className="index-num text-primary">{number}</span>
          <span className="index-num uppercase tracking-[0.2em]">{label}</span>
        </div>
        <h2 id={id} className="mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
