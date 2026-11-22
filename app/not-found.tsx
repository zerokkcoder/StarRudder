import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">这里没有你要找的航标</h1>
      <p className="mt-3 text-sm text-muted-foreground">页面可能已被移动，或者从未存在过。</p>
      <Button render={<Link href="/" />} className="mt-8">
        回到首页
      </Button>
    </div>
  );
}
