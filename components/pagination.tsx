import Link from "next/link";

export const PAGE_SIZE = 12;

export function pageCount(total: number, size = PAGE_SIZE) {
  return Math.max(1, Math.ceil(total / size));
}

export function Pagination({
  page,
  totalPages,
  basePath,
  params = {},
}: {
  page: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const href = (target: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) query.set(key, value);
    }
    query.set("page", String(target));
    return `${basePath}?${query.toString()}`;
  };

  return (
    <nav className="flex items-center justify-between py-4 index-num" aria-label="分页">
      {page > 1 ? (
        <Link href={href(page - 1)} className="hover:text-primary">← 上一页</Link>
      ) : (
        <span className="opacity-40">← 上一页</span>
      )}
      <span>
        第 {page} / {totalPages} 页
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className="hover:text-primary">下一页 →</Link>
      ) : (
        <span className="opacity-40">下一页 →</span>
      )}
    </nav>
  );
}
