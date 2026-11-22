import type { Metadata } from "next";
import { LinkImportForm } from "@/components/admin/link-import-form";
import { getSiteCategories } from "@/lib/queries";

export const metadata: Metadata = {
  title: "链接导入",
  robots: { index: false, follow: false },
};

export default async function ImportPage() {
  const categories = await getSiteCategories();

  return (
    <div className="container py-7">
      <header className="border-b pb-3" style={{ borderColor: "var(--border)" }}>
        <h1 className="text-xl font-semibold tracking-tight">链接导入</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          粘贴长文或开源库链接，自动抓取内容后入库，无需配置订阅源。
        </p>
      </header>
      <LinkImportForm categories={categories.map(({ id, name }) => ({ id, name }))} />
    </div>
  );
}
