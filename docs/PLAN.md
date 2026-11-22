# 星舵 StarRudder — 项目规划

> 站点导航网站：中文内容，面向全球，主做 Google SEO。
> 仓库：https://github.com/zerokkcoder/StarRudder.git

## 0. 决策摘要

| 项目 | 决策 |
|---|---|
| 站名 | 星舵 StarRudder |
| Slogan | 你的互联网罗盘 · 发现值得停泊的好站 |
| 语言 / SEO | 中文内容，`lang="zh-CN"`，面向全球主做 Google SEO，URL 用 ASCII slug |
| 技术栈 | Next.js 16 App Router + TypeScript + Tailwind v4 |
| UI | coss ui（Cal.com 设计系统，Base UI + Tailwind v4，复制源码模式） |
| 数据库 | 本地 PostgreSQL（非 Docker），数据库名 `star_rudder` |
| ORM | Drizzle ORM + drizzle-kit + postgres.js |
| 资讯来源 | RSS/API 聚合 + 后台手动发布（双来源，用 `source` 字段区分） |
| 后台 | 完整后台（Auth.js 鉴权 + 各实体 CRUD + 仪表盘） |
| 视觉风格 | 极简留白：暖白底 + 墨黑字 + 单一「星舵蓝」点缀色，无渐变、无花哨装饰 |
| 部署 | 先本地开发，后续再定（Vercel + Supabase/Neon 或自托管） |

## 1. 命名依据（Google Trends 热词调研）

- Google Trends 24 小时实时热榜（美/日/印/法等）几乎全是体育赛事、影视综艺、突发新闻，波动极大，不适合做品牌名。
- 持续上升趋势且有 SEO 价值的热词集中在 AI 领域：
  - 「智」当选 2026 中国年度字（2000 万人投票）
  - 「智能体 / AI 普惠 / 人工智能+」入选年度科普热词
  - Google 搜索中 "AI Mode" 同比 +646%，"AEO（答案引擎优化）" +237%，"GEO（生成式引擎优化）" +53%
- 最终选择「星舵 StarRudder」：星（发现/指引）+ 舵（导航/掌控），意象清晰、易记、可品牌化。
- 核心 SEO 词：`星舵`、`网址导航`、`AI 工具导航`、`好站推荐`、`科技资讯`。

## 2. 技术架构

| 层次 | 选型 |
|---|---|
| 框架 | Next.js 16.4.6 App Router + TypeScript |
| UI 基础 | coss ui：`pnpm dlx shadcn@latest init @coss/style`（Tailwind v4 + Base UI） |
| 图标 / 字体 | lucide-react；Inter（拉丁）+ 系统中文字体栈 |
| 数据库驱动 | postgres.js；ORM：Drizzle；迁移工具：drizzle-kit |
| 鉴权 | Auth.js（邮箱 + 密码，bcrypt），保护 `/admin` |
| 富文本 | Tiptap（资讯正文） |
| RSS | rss-parser + 受保护抓取路由（本地手动触发，后续可接 Vercel Cron） |
| 图片 | next/image；本地上传 `public/uploads`；next/og 动态生成分享图 |
| 校验 | zod（表单与 API 入参） |

## 3. 数据模型

```
users          管理员（id, email, password_hash, name, created_at）
categories     分类（id, name, slug, icon, type[site/news], sort）
sites          站点（id, name, slug, url, description, logo, category_id, tags[], clicks, status, featured, created_at）
articles       资讯（id, title, slug, summary, content, cover, category_id, tags[], source[manual/rss], source_url, published_at, status）
rss_sources    订阅源（id, name, url, category_id, last_fetched_at, status）
friend_links   友链（id, name, url, logo, description, status, sort, created_at）
submissions    用户提交（id, type[site/link], name, url, description, status, created_at）
```

> RSS 聚合策略：抓取后仅沉淀 **摘要 + 原文链接 + 来源署名**（避免全文转载的版权风险）；手动文章为原创全文。两者都进 `articles` 表，用 `source` 区分。

## 4. 页面与路由

**前台**
- `/` 首页：Hero + 全站搜索（⌘K）+ 精选站点 + 最新资讯 + 友链预览
- `/sites` 站点目录：分类筛选、搜索、卡片网格
- `/sites/[slug]` 站点详情（或卡片外链 + 点击计数）
- `/news` 资讯列表：分类/标签筛选、手动 + RSS 混合流
- `/news/[slug]` 资讯详情（JSON-LD Article）
- `/links` 友情链接
- `/submit` 提交站点/友链（写入 submissions）

**后台**（`/admin`，需登录）
- `/admin` 仪表盘（数据统计）
- `/admin/sites`、`/admin/categories`、`/admin/articles`、`/admin/rss-sources`、`/admin/links`、`/admin/submissions`
- `/admin/rss/fetch` 手动触发抓取（后续可配 Cron）

## 5. SEO 清单（中文内容 · 全球 Google）

- 每页独立 `metadata`：title / description / openGraph / twitter / alternates.canonical / robots
- `app/sitemap.ts` + `app/robots.ts` 自动生成
- JSON-LD：`WebSite`、`WebPage`、`BreadcrumbList`、`Article`、`ItemList`、`Organization`
- `<html lang="zh-CN">` + `metadataBase`；单语言用 `x-default` hreflang 占位
- 导航/详情/资讯页 SSG + ISR（revalidate）
- 语义化 HTML + 单一 H1 + 合理标题层级；URL 用英文/pinyin slug
- `next/og` 动态 OG 图；完整 `icon.tsx` / `manifest.ts` / favicon
- 接入 Google Search Console 验证文件；图片全部带中文 alt
- Core Web Vitals：控制 LCP / CLS / INP

## 6. 实施里程碑

- **M1 基础**：初始化项目 → coss ui 主题接入 → 极简布局、Header/Footer/搜索框 → 本地 PG + Drizzle 建表 + seed 示例数据
- **M2 导航模块**：分类 + 站点卡片 + 搜索筛选 + 点击计数 + 提交表单
- **M3 资讯 & 友链**：资讯列表/详情（手动 + RSS 聚合流与抓取任务）、友链页、Tiptap 编辑器
- **M4 后台**：Auth.js 鉴权 + 各实体 CRUD + 仪表盘 + submissions 审核
- **M5 SEO & 验收**：metadata / 结构化数据 / sitemap / robots / OG 图全量补齐 → 本地构建测试 → 再定部署方案

## 7. 注意事项

- **Next.js 16 有破坏性变更**：代码编写前先读 `node_modules/next/dist/docs/` 中相关指南（AGENTS.md 要求）。
- **coss ui 早期阶段**：基于 Base UI beta，可能有 breaking change；复制源码模式降低风险。
- **RSS 版权**：只展示摘要 + 原文链接，不做全文镜像。
- **中文 SEO**：内容中文但 slug / metadata 结构对英文爬虫友好；全球化时再加英文版并用 hreflang。
- **本地 → 线上**：先本地跑通，部署时再选 Supabase/Neon 或自托管。

## 8. 本地环境

- 本地 PostgreSQL：`localhost:5432`，用户 `postgres`，数据库 `star_rudder`
- 连接串写入 `.env.local`（不提交）：`DATABASE_URL=postgresql://postgres:<password>@localhost:5432/star_rudder`
- 连接串模板见 `.env.example`（提交）
- 数据库创建 SQL：`CREATE DATABASE star_rudder;`

## 9. 实施状态

### M1 基础（已完成）

- [x] Next.js 16 项目初始化，远程仓库 `zerokkcoder/StarRudder`
- [x] 本地 PostgreSQL：Drizzle schema（7 表）+ migration + seed（`pnpm db:generate / db:migrate / db:seed`）
- [x] coss ui 设计系统接入：因本机无法访问 coss.com（ECONNRESET），改为从官方 GitHub 仓库 `cosscom/ui` 的 registry JSON 直接生成组件源码到 `components/ui/`，样式 token 取自官方 `packages/ui/src/styles/globals.css` 并按「星舵蓝」极简风格重写
- [x] 根布局：Header（导航 + ⌘K 全站搜索 + 主题切换）、Footer、全局 metadata、JSON-LD
- [x] 首页：Hero + 精选站点 + 最新资讯 + 友情链接
- [x] 基础页面：`/sites`、`/news`、`/news/[slug]`（SSG）、`/links`、`/submit`（Server Action 写入 submissions）
- [x] SEO 基础：sitemap.xml、robots.txt、动态 icon、manifest、每页 metadata + JSON-LD
- [x] 验证：`pnpm typecheck`、`pnpm build` 通过；所有路由返回 200；浏览器无控制台错误

后台账号（seed）：`admin@starrudder.dev` / `Starrudder2026!`（M4 接入鉴权时使用）

> 注意：本机 `coss.com` 被网络阻断，后续如需新增 coss 组件，继续使用官方 GitHub registry JSON 本地提取的方式。

### 设计重构（M1 之后，已完成）

- 用户反馈原布局太普遍，新建完整设计规范 [docs/DESIGN.md](DESIGN.md)
- 概念：**Chart & Ledger（海图与索引）** —— 左侧固定导航轨道 + 编辑式首屏 + 罗盘方位图 + 编号索引行
- 已重构：全局令牌（4px 小圆角、无阴影、单强调色、海图点阵纹理）、SiteChrome 双端导航、HeroCompass、SectionHeading、SiteLedger、命令检索弹窗、页脚 Colophon、各页面排版
- 内容仍为服务端真实链接与文本，SEO 无退化

### M2 导航模块（已完成）

- [x] 分类筛选：`/sites?category=xxx`，服务端过滤，每个分类可索引
- [x] 关键词检索：`/sites?q=xxx`，与分类组合
- [x] 点击计数：`/go/{slug}` 302 跳转 + 原子自增（已实测 1280 → 1281）
- [x] 提交表单：Server Action 写入 `submissions` 表
- [x] 种子数据扩充至 15 个站点 / 5 个方位分类

### 待办

- M3 资讯与友链：RSS 抓取任务、Tiptap 编辑器、友链申请审核
- M4 后台管理：鉴权 + CRUD + 仪表盘（含 submissions 审核）
- M5 SEO 深化 + 上线部署
