"use client";

import { useEffect } from "react";

/**
 * 仅开发环境：忽略浏览器扩展注入脚本产生的 unhandled rejection。
 * Next.js 16 开发浮层会把这类错误显示出来，但它并非本站代码问题。
 */
export function DevErrorFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const handler = (event: PromiseRejectionEvent) => {
      const reason = event.reason as { stack?: string; message?: string } | string | undefined;
      const text =
        typeof reason === "string"
          ? reason
          : `${reason?.stack ?? ""} ${reason?.message ?? ""}`;
      if (
        text.includes("chrome-extension://") ||
        text.includes("Failed to connect to MetaMask")
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    window.addEventListener("unhandledrejection", handler, true);
    return () => window.removeEventListener("unhandledrejection", handler, true);
  }, []);
  return null;
}
