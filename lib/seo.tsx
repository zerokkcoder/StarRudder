import type { Metadata } from "next";
import { siteConfig } from "./site";

type PageSeo = {
  title: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  publishedTime?: string;
};

/** 统一的 Metadata 生成：canonical / OG / Twitter / robots 一次到位 */
export function createMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  type = "website",
  publishedTime,
}: PageSeo): Metadata {
  const url = new URL(path, siteConfig.url).toString();

  return {
    title,
    description,
    keywords: [...siteConfig.keywords],
    applicationName: siteConfig.name,
    alternates: {
      canonical: url,
      languages: {
        "x-default": url,
        "zh-CN": url,
      },
    },
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/** 输出 JSON-LD 结构化数据的 <script> 标签 */
export function JsonLd({ schema }: { schema: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify 输出的是结构化数据，非用户输入脚本
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  alternateName: siteConfig.nameEn,
  url: siteConfig.url,
  description: siteConfig.description,
  inLanguage: "zh-CN",
} as const;

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
} as const;
