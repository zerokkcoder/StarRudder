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
    <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b pb-2" style={{ borderColor: "var(--border)" }}>
      <div>
        <div className="flex items-center gap-2">
          <span className="index-num text-primary">{number}</span>
          <span className="index-num">{label}</span>
        </div>
        <h2 id={id} className="mt-1 text-lg font-semibold tracking-tight">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
