export const siteConfig = {
  name: "星舵",
  nameEn: "StarRudder",
  slogan: "你的互联网罗盘 · 发现值得停泊的好站",
  description:
    "星舵 StarRudder 是一个精心策展的中文站点导航，收录优质 AI 工具、设计灵感、开发资源与科技资讯，帮你在信息海洋里找到方向。",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "zh_CN",
  keywords: [
    "星舵",
    "StarRudder",
    "网址导航",
    "站点导航",
    "AI 工具导航",
    "好站推荐",
    "科技资讯",
    "设计灵感",
    "开发资源",
  ],
  nav: [
    { label: "首页", href: "/" },
    { label: "站点导航", href: "/sites" },
    { label: "资讯", href: "/news" },
    { label: "友情链接", href: "/links" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
