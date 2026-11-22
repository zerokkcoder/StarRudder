import { config } from "dotenv";
import { hash } from "bcryptjs";

config({ path: ".env.local" });

import { db } from "./index";
import {
  articles,
  categories,
  friendLinks,
  rssSources,
  sites,
  submissions,
  users,
} from "./schema";

const siteCategoryData = [
  { name: "AI 工具", slug: "ai-tools", icon: "Sparkles", type: "site", sort: 1 },
  { name: "设计灵感", slug: "design", icon: "Palette", type: "site", sort: 2 },
  { name: "开发资源", slug: "dev", icon: "Code2", type: "site", sort: 3 },
  { name: "效率办公", slug: "productivity", icon: "Zap", type: "site", sort: 4 },
  { name: "学习成长", slug: "learning", icon: "BookOpen", type: "site", sort: 5 },
  { name: "科技资讯", slug: "tech-news", icon: "Newspaper", type: "news", sort: 6 },
];

const siteData = [
  { name: "ChatGPT", slug: "chatgpt", url: "https://chatgpt.com", description: "OpenAI 推出的对话式 AI 助手，写作、编程、学习的好帮手。", cat: "ai-tools", tags: ["AI", "对话", "写作"], featured: true, clicks: 1280 },
  { name: "Claude", slug: "claude", url: "https://claude.ai", description: "Anthropic 开发的 AI 助手，擅长长文本理解与代码编写。", cat: "ai-tools", tags: ["AI", "代码", "长文本"], featured: true, clicks: 960 },
  { name: "Perplexity", slug: "perplexity", url: "https://perplexity.ai", description: "以引用来源为核心的 AI 搜索引擎，适合做资料调研。", cat: "ai-tools", tags: ["AI", "搜索"], featured: false, clicks: 640 },
  { name: "Dribbble", slug: "dribbble", url: "https://dribbble.com", description: "全球设计师作品社区，寻找灵感与趋势的地方。", cat: "design", tags: ["设计", "灵感"], featured: true, clicks: 740 },
  { name: "Figma", slug: "figma", url: "https://figma.com", description: "协作式界面设计工具，产品团队的标配。", cat: "design", tags: ["设计", "协作"], featured: false, clicks: 1120 },
  { name: "Awwwards", slug: "awwwards", url: "https://awwwards.com", description: "全球优秀网页设计作品评选与展示平台。", cat: "design", tags: ["设计", "灵感"], featured: false, clicks: 430 },
  { name: "GitHub", slug: "github", url: "https://github.com", description: "全球最大的代码托管平台，开源项目的聚集地。", cat: "dev", tags: ["代码", "开源"], featured: false, clicks: 2100 },
  { name: "coss ui", slug: "coss-ui", url: "https://coss.com/ui", description: "Cal.com 官方设计系统，基于 Base UI 与 Tailwind CSS 的可访问组件库。", cat: "dev", tags: ["UI", "组件库", "React"], featured: true, clicks: 512 },
  { name: "MDN Web Docs", slug: "mdn", url: "https://developer.mozilla.org", description: "Web 技术权威文档，前端开发者的工具书。", cat: "dev", tags: ["文档", "前端"], featured: false, clicks: 1890 },
  { name: "Vercel", slug: "vercel", url: "https://vercel.com", description: "面向前端框架的一体化部署与托管平台。", cat: "dev", tags: ["部署", "DevOps"], featured: false, clicks: 970 },
  { name: "Notion", slug: "notion", url: "https://notion.so", description: "集笔记、知识库、项目管理于一体的效率工具。", cat: "productivity", tags: ["笔记", "协作"], featured: false, clicks: 880 },
  { name: "Linear", slug: "linear", url: "https://linear.app", description: "为高效团队打造的项目管理工具，交互体验极佳。", cat: "productivity", tags: ["协作", "效率"], featured: false, clicks: 720 },
  { name: "Excalidraw", slug: "excalidraw", url: "https://excalidraw.com", description: "手绘风格的在线白板，快速画草图与流程图。", cat: "productivity", tags: ["白板", "绘图"], featured: false, clicks: 510 },
  { name: "Khan Academy", slug: "khan-academy", url: "https://khanacademy.org", description: "免费公开课平台，涵盖数学、计算机与人文科学。", cat: "learning", tags: ["学习", "课程"], featured: false, clicks: 480 },
];

const articleData = [
  {
    title: "2026 年度热词盘点：AI 智能体成为焦点",
    slug: "2026-ai-agent-buzzwords",
    summary: "从「智能体」到「AI 普惠」，人工智能相关词汇占据了年度热词榜单的多数席位。",
    content: "2026 年，人工智能相关词汇成为年度热词的重要组成部分。「智能体」「人工智能+」「AI 普惠」等概念频繁出现在公众视野，反映 AI 正加快融入生产生活。\n\n对于内容创作者与开发者而言，关注这些趋势有助于把握技术方向，但更重要的是把工具用在真正创造价值的地方。",
    tags: ["AI", "趋势"],
    source: "manual",
    publishedAt: new Date("2026-11-20T09:00:00Z"),
  },
  {
    title: "Next.js 16 正式发布：你需要了解的变化",
    slug: "nextjs-16-release-highlights",
    summary: "新版本在路由、构建与开发者体验上带来多项更新，升级前建议阅读官方迁移指南。",
    content: "Next.js 16 带来了多项破坏性变更与改进。升级前请务必阅读官方文档中的迁移说明，逐一核对路由约定、缓存行为与配置变化。\n\n对于新项目，直接从最新版开始是更省心的选择。",
    tags: ["Next.js", "前端"],
    source: "manual",
    publishedAt: new Date("2026-11-18T09:00:00Z"),
  },
  {
    title: "coss ui：Cal.com 开源设计系统现已开放",
    slug: "coss-ui-design-system",
    summary: "基于 Base UI 与 Tailwind CSS，采用复制源码模式，开发者可完全掌控组件代码。",
    content: "coss ui 是 Cal.com 团队开源的设计系统，采用类似 shadcn/ui 的复制粘贴模式，而非 npm 包依赖。组件基于 Base UI 构建，样式使用 Tailwind CSS v4。",
    tags: ["UI", "开源"],
    source: "rss",
    sourceUrl: "https://coss.com/ui",
    publishedAt: new Date("2026-11-15T09:00:00Z"),
  },
];

async function main() {
  console.log("重置数据库...");
  await db.delete(articles);
  await db.delete(sites);
  await db.delete(rssSources);
  await db.delete(friendLinks);
  await db.delete(submissions);
  await db.delete(categories);
  await db.delete(users);

  await db.insert(users).values({
    email: "admin@starrudder.dev",
    passwordHash: await hash("Starrudder2026!", 10),
    name: "星舵管理员",
  });

  await db.insert(categories).values(siteCategoryData);
  const allCategories = await db.select().from(categories);
  const catId = (slug: string) => allCategories.find((c) => c.slug === slug)?.id ?? null;

  await db.insert(sites).values(
    siteData.map((site) => ({
      name: site.name,
      slug: site.slug,
      url: site.url,
      description: site.description,
      categoryId: catId(site.cat),
      tags: site.tags,
      clicks: site.clicks,
      featured: site.featured,
    })),
  );

  await db.insert(articles).values(
    articleData.map((article) => ({
      title: article.title,
      slug: article.slug,
      summary: article.summary,
      content: article.content,
      categoryId: catId("tech-news"),
      tags: article.tags,
      source: article.source,
      sourceUrl: "sourceUrl" in article ? article.sourceUrl : null,
      publishedAt: article.publishedAt,
    })),
  );

  await db.insert(rssSources).values([
    { name: "少数派", url: "https://sspai.com/feed", categoryId: catId("tech-news") },
    { name: "InfoQ 中文", url: "https://www.infoq.cn/feed", categoryId: catId("tech-news") },
  ]);

  await db.insert(friendLinks).values([
    { name: "coss.com", url: "https://coss.com", description: "开放、可持续的商业开源软件公司。", sort: 1 },
    { name: "Next.js", url: "https://nextjs.org", description: "用于构建全栈 Web 应用的 React 框架。", sort: 2 },
  ]);

  console.log("Seed 完成。后台账号：admin@starrudder.dev / Starrudder2026!");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
