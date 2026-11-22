export function CompassMark({
  className = "size-6",
  spin = false,
  title = "星舵罗盘",
}: {
  className?: string;
  spin?: boolean;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={`${className} ${spin ? "animate-compass-spin" : ""}`}
      role="img"
      aria-label={title}
    >
      <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="24" cy="24" r="15" stroke="currentColor" strokeWidth="0.6" opacity="0.45" />
      <path d="M24 1v7M24 40v7M1 24h7M40 24h7" stroke="currentColor" strokeWidth="1.2" />
      <path d="M24 9v4M24 35v4M9 24h4M35 24h4" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <path d="M24 13 27.5 24 24 21 20.5 24 24 13Z" fill="currentColor" />
      <path d="M24 35 20.5 24 24 27 27.5 24 24 35Z" fill="currentColor" opacity="0.28" />
      <circle cx="24" cy="24" r="1.6" fill="currentColor" />
    </svg>
  );
}
