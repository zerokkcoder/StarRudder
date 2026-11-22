# 星舵 StarRudder · SEO 与 Google Trends 持续改进

## 一、已经做了什么（可直接验收）

| 类别 | 实现 | 验证方式 |
|---|---|---|
| 域名与 URL | 全站 `https://starrudder.cc`；URL 为语义化 ASCII slug（`/sites`、`/news/[slug]`、`/links`） | 看地址栏与 canonical |
| 每页元数据 | `title` / `description` / `keywords` / `openGraph` / `twitter` / `robots` / `alternates.canonical`；`metadataBase` 由 `NEXT_PUBLIC_SITE_URL` 统一注入 | 查看源码 `<head>` |
| 站点地图 | `app/sitemap.ts` 自动生成，含静态页 + 全部内容详情页 | `https://starrudder.cc/sitemap.xml` |
| 爬虫规则 | `app/robots.ts` 放行内容页，禁止 `/admin`、`/api/`、`/go/` | `https://starrudder.cc/robots.txt` |
| 结构化数据 | `WebSite`、`Organization`、`ItemList`、`Article` JSON-LD；后台页面 `noindex` | Google Rich Results Test |
| 渲染策略 | 内容详情 `generateStaticParams` 全量 SSG，列表按需服务端渲染；内容在服务端 HTML 中，非 JS 注入 | curl 页面源码可见正文 |
| 语义化结构 | 单一 `h1`，章节 `h2`，列表 `ul/li/a`，`nav`/`header`/`footer` 有 `aria-label` | Lighthouse 可访问性 |
| 图片与图标 | `next/og` 动态图标、manifest、OG/Twitter 卡片 | 分享到社交平台预览 |
| 性能 | 本地字体（`@fontsource-variable/inter`，无外网请求）、Turbopack 构建、standalone 部署 | Lighthouse Performance |
| 多语言占位 | `lang="zh-CN"` + `hreflang="x-default"` / `zh-CN` | `<head>` 中 `link rel=alternate` |

后台 **`/admin/seo`** 页面集中展示上述状态、站点地图链接与当前重点关键词。

---

## 二、如何体现「做了 SEO」

1. **看后台**：`/admin/seo` 一眼可见域名、canonical、sitemap、robots、结构化数据、重点关键词。
2. **看源码**：任意页面 `Ctrl+U`，搜索 `canonical`、`og:title`、`application/ld+json`。
3. **看搜索引擎**：
   - Google Search Console → 网址前缀 `https://starrudder.cc` → 站点地图提交 `sitemap.xml`
   - 「网址检查」查看是否被索引、canonical 是否正确
   - Rich Results Test 检查结构化数据
4. **看收录量**：GSC「网页」报告，确认内容详情页逐步被收录。

---

## 三、结合 Google Trends 持续改进（每周循环）

### 第 1 步：找趋势词
- 打开 [Google Trends](https://trends.google.com/trends/explore?geo=CN&category=0)，地区选 `中国`/`全球`，时间选「过去 7 天 / 30 天」。
- 重点看 **「相关查询」→「上升」** 与 **「热门话题」**，记录 5–10 个与本站主题相关的 rising 词（AI、工具、开发、效率等）。
- 同时看 GSC「效果」报告里**已有曝光但点击率低**的词——这些是低成本优化机会。

### 第 2 步：把词落到站点结构
- **新分类**：趋势形成稳定主题时，在 `/admin/categories` 新增分类。
- **站点标签**：在 `/admin/sites` 编辑条目标签，加入趋势词（标签会进入页面文本，且被 sitemap 覆盖）。
- **新内容**：在 `/admin/articles/new` 用 Tiptap 写原创，或在 `/admin/articles/import` 粘贴长文/开源库链接自动抓取后入库。
- **聚合补充**：在 `/admin/rss-sources` 增加该主题的中英文订阅源，用 `pnpm rss:fetch` 或后台「立即抓取」补充摘要。

### 第 3 步：更新重点关键词
- 把验证过的趋势词补进 `lib/site.ts` 的 `keywords`（全局 metadata 关键词）与 `/admin/seo` 展示清单。
- 若某词连续两周上升且带来曝光，优先为它新增一个专题页或 3–5 条站点条目。

### 第 4 步：跟踪与淘汰
- 每周记录：GSC 的**展示次数 / 点击 / 点击率 / 平均排名**、已索引页面数。
- 若某词 4 周无曝光或排名跌出前 20，暂停投入；把资源转到新的上升词。
- 每月用 Lighthouse 复查性能与 SEO 分数，避免新增交互拖慢 Core Web Vitals。

### 节奏建议
| 周期 | 动作 |
|---|---|
| 每周 | 查 Trends 上升词 + GSC 效果报告，挑 3 个词落地 |
| 每两周 | 发布 1–2 篇原创内容或导入优质长文，补充对应分类 |
| 每月 | 复查 sitemap 收录、Lighthouse、淘汰无效关键词 |

> 注意：Google Trends 是**相对兴趣**而非绝对搜索量，百分比暴涨可能只是小基数。要结合 GSC 的真实曝光/点击判断价值。
