import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // M1 先用成熟的 ISR 方案；后续可开启 cacheComponents + use cache
  serverExternalPackages: ["postgres"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
