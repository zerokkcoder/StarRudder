import Link from "next/link";
import { CompassMark } from "@/components/compass-mark";

export default function NotFound() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center">
      <CompassMark className="size-12 text-primary" />
      <p className="index-num mt-8 text-primary">信号丢失 · 404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">这里没有你要找的航标</h1>
      <p className="mt-3 text-sm text-muted-foreground">页面可能已被移动，或者从未存在过。</p>
      <Link href="/" className="mt-10 border px-5 py-2.5 text-xs transition-colors hover:border-primary hover:text-primary">
        返回初始坐标
      </Link>
    </div>
  );
}
