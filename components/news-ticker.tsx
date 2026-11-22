import Link from "next/link";

export function NewsTicker({
  articles,
}: {
  articles: { title: string; slug: string }[];
}) {
  if (articles.length === 0) return null;
  const items = [...articles, ...articles];

  return (
    <div className="ticker-mask relative flex h-9 items-center overflow-hidden border-b bg-muted/40" style={{ borderColor: "var(--border)" }}>
      <span className="index-num z-10 flex h-full shrink-0 items-center gap-2 border-r bg-background px-4 text-primary" style={{ borderColor: "var(--border)" }}>
        <span className="size-1.5 rounded-full bg-primary" />
        SIGNAL
      </span>
      <div className="ticker-track flex items-center">
        {items.map((article, index) => (
          <Link
            key={`${article.slug}-${index}`}
            href={`/news/${article.slug}`}
            className="flex shrink-0 items-center gap-3 px-6 text-xs text-muted-foreground transition-colors hover:text-primary"
          >
            <span className="index-num">/ /</span>
            <span className="whitespace-nowrap">{article.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
