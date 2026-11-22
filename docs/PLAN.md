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
| 数据库 | MySQL 8（schema 兼容 5.7），本地数据库名/用户/密码均为 `star_rudder` |
| ORM | Drizzle ORM + drizzle-kit + mysql2 |
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

### 设计 v1.1「紧凑海图」（已完成）

- 用户反馈 v1.0 仍不够紧凑、缺少惊喜；设计规范升级至 v1.1，见 [DESIGN.md](DESIGN.md)
- 紧凑化：区块留白 96–128px → 56–80px，索引行 72px → 56px，条目名称 14 → 15px，章节头间距收紧
- 惊喜交互：指针聚光跟随、交互式罗盘（指针跟随鼠标 + 点击随机航向）、随机发现按钮（右下角 + 快捷键 R + 全屏航线动画）、数字滚动、资讯跑马灯、命令面板 ↑↓/Enter 与匹配高亮、左侧滚动进度条
- 新增 `DevErrorFilter`：仅开发环境忽略浏览器扩展（如 MetaMask）注入脚本的 unhandled rejection，避免干扰调试

### M3 资讯与友链（已完成）

- [x] RSS 聚合：`lib/rss.ts` + `POST /api/rss/fetch`（Bearer CRON_SECRET）+ `pnpm rss:fetch`；按 sourceUrl 去重、仅沉淀摘要与原文链接；实测 2 源新增 24 条，二次抓取新增 0 条
- [x] Tiptap 编辑器：`components/tiptap-editor.tsx`，已在后台「新建资讯」页接入，支持标题、加粗、列表、引用、代码块
- [x] 友链/站点提交审核：JWT 会话鉴权（jose + httpOnly cookie）、`/admin/login`、`/admin/submissions` 收录/忽略（友链写入 friend_links，站点写入 sites）、退出登录；端到端实测通过
- [x] 新增秘钥：`CRON_SECRET`、`AUTH_SECRET`（见 `.env.example`）

### 设计 v1.2「极紧凑中文索引」（已完成）

- 主内容 980px、侧栏 176px；首页第一屏即「最新资讯」列表（8 条），其后为精选站点与友链
- 全站 UI 中文化：导航、章节、按钮、表单、后台、错误页均使用中文；移除装饰性英文小标与中英混排
- RSS 源改为中文来源（少数派、InfoQ 中文），抓取 22 条中文资讯
- 候选域名清单见 [docs/DOMAINS.md](DOMAINS.md)

### M4 后台管理（已完成）

- [x] 仪表盘 `/admin`：站点/资讯/分类/友链/订阅源/待审核数量总览 + 管理入口 + 最近待审
- [x] 站点 CRUD：`/admin/sites`、`/admin/sites/[id]`（新增/编辑/删除/精选/状态）
- [x] 分类 CRUD：`/admin/categories`（新增/删除）
- [x] 资讯管理：`/admin/articles`（列表/删除）、`/admin/articles/new`（Tiptap 发布）
- [x] 订阅源管理：`/admin/rss-sources`（新增/删除/立即抓取）
- [x] 友链管理：`/admin/friend-links`（新增/删除）
- [x] 提交审核：`/admin/submissions`（收录/忽略）
- [x] JWT 会话鉴权、统一后台导航与退出登录；后台页面均 noindex

### 数据库切换 MySQL（已完成）

- 从 PostgreSQL 迁移到 MySQL 8（本地 5.7 亦兼容）：`mysql2` + drizzle mysql-core，迁移文件重新生成
- schema 避免使用 MySQL 5.7 不支持的 TEXT 默认值与 `(now())` 表达式默认，唯一索引长度控制在 1000 字节内
- 迁移 + seed 已在本地 MySQL 实测通过；页面与后台 HTTP 验证正常
- 数据库/表字符集需为 utf8mb4且连接显式执行 `SET NAMES utf8mb4`（本地 5.7 默认 utf8mb3 无法存 emoji）；RSS 摘要同时过滤 4 字节字符作为兜底

### M5 部署准备（已完成，待服务器上执行）

- [x] 域名已购买：`starrudder.cc`；`NEXT_PUBLIC_SITE_URL`、canonical、sitemap、robots、OG 全部切换
- [x] Google Search Console 验证串支持 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- [x] `next.config.ts` 开启 `output: "standalone"`（构建产物 `.next/standalone/server.js` 已验证）
- [x] 部署指南 `docs/DEPLOY.md`：线上 PostgreSQL 建库、环境变量、standalone 上传、PM2、Nginx + HTTPS、RSS cron、SEO 上线清单
- [x] `ecosystem.config.js`（PM2）
- [x] 后台页面去掉前端左侧导航，改为**后台专属左侧菜单**；前端左侧导航文案改为 2 字（首页/站点/资讯/友链）
- [x] 侧栏 152px；内容区居中、最大宽 1200px（修正宽屏右侧留白过大的问题）
- [x] 后台新增/编辑表单改为弹窗（站点、分类、订阅源、友链），列表页不再直接展示表单
- [x] 列表分页：公共资讯、站点目录，后台站点/分类/资讯/订阅源/友链/审核，统一 12 条/页，中文「上一页/下一页/第 X / Y 页」

### 收尾修正（已完成）

- 站内检索输入框改用原生 input，修复 coss Input 包裹层样式导致的显示错乱
- 登录路由从 `/login` 迁移到 `/admin/login`（用路由组 `(auth)` 避开后台布局守卫）
- 后台左侧菜单统一为 3–4 字；后台首页移除「管理入口」区块；弹窗表单内容与按钮增加内边距
- 新增后台 `/admin/seo` 状态页与 `docs/SEO.md`（SEO 验收清单 + Google Trends 每周持续改进流程）
- 资讯详情页补充 `BreadcrumbList` JSON-LD
- 修复资讯详情 404：Next 传入的 `params.slug` 是 percent-encoded 字符串，页面内先 `decodeURIComponent` 再查库
- 站内检索触发器加 `whitespace-nowrap`，「站内检索」保持单行
- 提交表单新增「所属分类」（写入 `submissions.categoryId`，审核收录时带入站点）；从友链页进入自动预选「友情链接」
- 前台内容区改为 flex 列布局，`main` 自适应，页脚在内容少时仍贴底、高度一致
- 前端 SSR 默认浅色（`<html>` 不带 `dark`），用户保存过深色时由绘制前脚本加上；彻底消除浅色用户刷新闪黑。后台仍默认深色且独立控制
- 后台增加**独立主题开关**（`star-rudder-admin-theme`，作用于 `#admin-root` 的 `data-theme`，不影响前台）
- 内容模块重构：新增「链接导入」——粘贴长文链接 / GitHub 仓库链接，自动抓取标题、摘要与正文（GitHub 走 API + README），可在后台核对编辑后入库（`source=link`）；RSS 订阅源保留为可选补充
- 用户可见文案「资讯」改为「内容」（路由 `/news` 保持不变，避免影响 SEO）
- 链接导入增强：GitHub 改用 API `/readme`（raw）+ `/topics`，补全语言/星标/许可/主页/主题与完整 README；X 推文改用 fxtwitter 镜像接口，长文直接取 `article.content.blocks`，实测可抓回 6000+ 字正文
- 聚合内容补全正文：优先用 feed 的 `content:encoded`/`content` 转纯文本，不足则回源抓网页正文；新增 `pnpm rss:backfill` 补全历史条目。实测 7 源新增 82 条，正文平均约 3.9KB（单条最长 32KB）
- 按用户聚焦方向重建订阅源：清空旧聚合内容与订阅源，新增 4 个资讯分类（编程开发 / AI 进展 / 游戏开发 / 产品设计），共 12 个可用源：
  - 编程开发：OSCHINA、掘金、Smashing Magazine、A List Apart（InfoQ 中文因抓取内容不全已移除）
  - AI 进展：量子位、新智元
  - 游戏开发：机核、Gamelook
  - 产品设计：少数派、Product Hunt、UX Collective
  - 探测后排除：机器之心（XML 错误）、HuggingFace/OpenAI/Google AI/Unity（网络不可达）、GameDeveloper（403）、indienova/游戏葡萄（404）、优设/设计癖（格式错误）
- 链接导入表单去掉「标签」，改为「作者」（文章表新增 `author` 字段，详情页展示）；深色下原生下拉框设置 `color-scheme: dark`，不再白色突兀
- 前台首页精简为只展示站点索引列表（移除内容列表与友情链接区块）
- 前端左侧导航去掉「首页」，站点即首页：`站点 / 内容 / 友链`；`/` 与 `/sites` 均高亮「站点」
- 站点列表改为卡片网格（coss Card，2–3 列），保留编号、指针聚光与悬停位移
- 主题闪烁修复：`beforeInteractive` 脚本在首屏绘制前读取 `star-rudder-theme` 并设置/移除 `dark` 类，避免「先深后浅」

> 剩余事项需在用户的线上服务器执行：MySQL 建库、迁移、上传产物、Nginx/HTTPS、PM2 启动、Google 验证。
