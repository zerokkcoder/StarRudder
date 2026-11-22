import type { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...createMetadata({ title: "管理员登录", path: "/admin/login" }),
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-sm border p-8" style={{ borderColor: "var(--border)" }}>
        <p className="index-num text-primary">后台入口</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">管理员登录</h1>
        <LoginForm />
      </div>
    </div>
  );
}
