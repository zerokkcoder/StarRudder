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
  users,
} from "./schema";

async function main() {
  console.log("Seeding database...");

  // 幂等清库（仅开发用）
  await db.delete(rssSources);
  await db.delete(articles);
  await db.delete(sites);
  await db.delete(friendLinks);
  await db.delete(categories);
  await db.delete(users);

  const [admin] = await db
    .insert(users)
    .values({
      email: "admin@starrudder.dev",
      passwordHash: await hash("Starrudder2026!", 10),
      name: "星舵管理员",
    })
    .returning();

  const siteCategories = await db
    .insert(categories)
    .values([
      { name: "AI 工具", slug: "ai-tools", icon: "Sparkles", type: "site", sort: 1 },
      { name: "设计灵感", slug: "design", icon: "Palette", type: "site", sort: 2 },
      { name: "开发资源", slug: "dev", icon: "Code2", type: "site", sort: 3 },
      { name: "效率办公", slug: "productivity", icon: "Zap", type: "site", sort: 4 },
      { name: "学习成长", slug: "learning", icon: "BookOpen", type: "site", sort: 5 },
    ])
    .returning();

  const newsCategory = await db
    .insert(categories)
    .values({ name: "科技资讯", slug: "tech-news", icon: "Newspaper", type: "news", sort: 1 })
    .returning();

  await db.insert(sites).values([
    {
      name: "ChatGPT",
      slug: "chatgpt",
      url: "https://chatgpt.com",
      description: "OpenAI 推出的对话式 AI 助手，写作、编程、学习的好帮手。",
      categoryId: siteCategories[0].id,
      tags: ["AI", "对话", "写作"],
      featured: true,
      clicks: 1280,
    },
    {
      name: "Claude",
      slug: "claude",
      url: "https://claude.ai",
      description: "Anthropic 开发的 AI 助手，擅长长文本理解与代码编写。",
      categoryId: siteCategories[0].id,
      tags: ["AI", "代码", "长文本"],
      featured: true,
      clicks: 960,
    },
    {
      name: "coss ui",
      slug: "coss-ui",
      url: "https://coss.com/ui",
      description: "Cal.com 官方设计系统，基于 Base UI 与 Tailwind CSS 的可访问组件库。",
      categoryId: siteCategories[2].id,
      tags: ["UI", "组件库", "React"],
      featured: true,
      clicks: 512,
    },
    {
      name: "Dribbble",
      slug: "dribbble",
      url: "https://dribbble.com",
      description: "全球设计师作品社区，寻找灵感与趋势的地方。",
      categoryId: siteCategories[1].id,
      tags: ["设计", "灵感"],
      featured: true,
      clicks: 740,
    },
    {
      name: "GitHub",
      slug: "github",
      url: "https://github.com",
      description: "全球最大的代码托管平台，开源项目的聚集地。",
      categoryId: siteCategories[2].id,
      tags: ["代码", "开源"],
      featured: false,
      clicks: 2100,
    },
    {
      name: "Notion",
      slug: "notion",
      url: "https://notion.so",
      description: "集笔记、知识库、项目管理于一体的效率工具。",
      categoryId: siteCategories[3].id,
      tags: ["笔记", "协作"],
      featured: false,
      clicks: 880,
    },
  ]);

  await db.insert(articles).values([
    {
      title: "2026 年度热词盘点：AI 智能体成为焦点",
      slug: "2026-ai-agent-buzzwords",
      summary: "从「智能体」到「AI 普惠」，人工智能相关词汇占据了年度热词榜单的多数席位。",
      content:
        "2026 年，人工智能相关词汇成为年度热词的重要组成部分。「智能体」「人工智能+」「AI 普惠」等概念频繁出现在公众视野，反映 AI 正加快融入生产生活。\n\n对于内容创作者与开发者而言，关注这些趋势有助于把握技术方向，但更重要的是把工具用在真正创造价值的地方。",
      categoryId: newsCategory[0].id,
      tags: ["AI", "趋势"],
      source: "manual",
      publishedAt: new Date("2026-11-20T09:00:00Z"),
    },
    {
      title: "Next.js 16 正式发布：你需要了解的变化",
      slug: "nextjs-16-release-highlights",
      summary: "新版本在路由、构建与开发者体验上带来多项更新，升级前建议阅读官方迁移指南。",
      content:
        "Next.js 16 带来了多项破坏性变更与改进。升级前请务必阅读官方文档中的迁移说明，逐一核对路由约定、缓存行为与配置变化。\n\n对于新项目，直接从最新版开始是更省心的选择。",
      categoryId: newsCategory[0].id,
      tags: ["Next.js", "前端"],
      source: "manual",
      publishedAt: new Date("2026-11-18T09:00:00Z"),
    },
    {
      title: "coss ui：Cal.com 开源设计系统现已开放",
      slug: "coss-ui-design-system",
      summary: "基于 Base UI 与 Tailwind CSS，采用复制源码模式，开发者可完全掌控组件代码。",
      content:
        "coss ui 是 Cal.com 团队开源的设计系统，采用类似 shadcn/ui 的复制粘贴模式，而非 npm 包依赖。组件基于 Base UI 构建，样式使用 Tailwind CSS v4。",
      categoryId: newsCategory[0].id,
      tags: ["UI", "开源"],
      source: "rss",
      sourceUrl: "https://coss.com/ui",
      publishedAt: new Date("2026-11-15T09:00:00Z"),
    },
  ]);

  await db.insert(rssSources).values([
    {
      name: "示例科技博客",
      url: "https://example.com/feed.xml",
      categoryId: newsCategory[0].id,
      status: "active",
    },
  ]);

  await db.insert(friendLinks).values([
    {
      name: "coss.com",
      url: "https://coss.com",
      description: "开放、可持续的商业开源软件公司。",
      sort: 1,
    },
    {
      name: "Next.js",
      url: "https://nextjs.org",
      description: "用于构建全栈 Web 应用的 React 框架。",
      sort: 2,
    },
  ]);

  console.log("Seed complete.");
  console.log("Admin login: admin@starrudder.dev / Starrudder2026!");
  console.log(`Admin id: ${admin.id}`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
