import { load } from "cheerio";

export type ImportedContent = {
  title: string;
  summary: string;
  content: string;
  sourceUrl: string;
  author: string;
  tags: string[];
};

function clean(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\u200b/g, "")
    .trim();
}

function paragraphs(parts: string[]) {
  return parts
    .map((part) => clean(part))
    .filter((part) => part.length > 1)
    .slice(0, 400)
    .join("\n\n")
    .slice(0, 20000);
}

function markdownToText(md: string) {
  const blocks = md
    .replace(/```[\s\S]*?```/g, (block) => block.replace(/^```[^\n]*\n?/, "").replace(/```$/, ""))
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*+>]\s+/gm, "")
    .split(/\n\s*\n/);
  return paragraphs(blocks);
}

/** 把 HTML 正文转成按空行分段的纯文本 */
export function htmlToParagraphs(html: string) {
  const $ = load(html);
  $("script, style, nav, footer, header, aside, noscript, iframe").remove();
  const scope = $("article").length ? $("article") : $("main").length ? $("main") : $("body");
  const parts = scope
    .find("p, h2, h3, li")
    .map((_, el) => $(el).text())
    .get();
  return paragraphs(parts) || paragraphs([$("body").text()]);
}

/** 抓取网页并提取正文纯文本（用于 RSS 条目补全全文） */
export async function extractPageText(url: string, timeoutMs = 15000) {
  return htmlToParagraphs(await fetchText(url, {}, timeoutMs));
}

async function fetchText(url: string, headers: Record<string, string> = {}, timeoutMs = 15000) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "StarRudder Content Importer/1.0 (+https://starrudder.cc)",
      ...headers,
    },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`抓取失败：HTTP ${response.status}`);
  return response.text();
}

/* ---------------- GitHub ---------------- */

type GithubMeta = {
  name?: string;
  full_name?: string;
  description?: string | null;
  language?: string | null;
  stargazers_count?: number;
  homepage?: string | null;
  license?: { spdx_id?: string } | null;
};

async function fromGithub(owner: string, repo: string, sourceUrl: string): Promise<ImportedContent> {
  const api = `https://api.github.com/repos/${owner}/${repo}`;
  const ghHeaders = { Accept: "application/vnd.github+json" };
  const [metaRaw, readmeRaw, topicsRaw] = await Promise.all([
    fetchText(api, ghHeaders).catch(() => "{}"),
    fetchText(`${api}/readme`, { Accept: "application/vnd.github.raw+json" }).catch(() => ""),
    fetchText(`${api}/topics`, ghHeaders).catch(() => '{"names":[]}'),
  ]);

  let meta: GithubMeta = {};
  let topics: string[] = [];
  try {
    meta = JSON.parse(metaRaw);
  } catch {
    // 用 URL 中的仓库名兜底
  }
  try {
    topics = JSON.parse(topicsRaw).names ?? [];
  } catch {
    // 忽略主题解析失败
  }

  const title = meta.name || repo;
  const readme = readmeRaw ? markdownToText(readmeRaw) : "";
  const firstParagraph = readme.split("\n\n").map(clean).find((part) => part.length > 10) || "";
  const summary = clean(meta.description || firstParagraph || `开源项目 ${owner}/${repo}`);
  const info = [
    summary,
    `项目地址：${sourceUrl}`,
    `仓库：${meta.full_name || `${owner}/${repo}`}`,
    meta.language ? `主要语言：${meta.language}` : "",
    typeof meta.stargazers_count === "number" ? `星标：${meta.stargazers_count}` : "",
    meta.license?.spdx_id ? `许可：${meta.license.spdx_id}` : "",
    meta.homepage ? `主页：${meta.homepage}` : "",
    topics.length ? `主题：${topics.join("、")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const content = `${info}\n\n${readme ? `## 项目说明（README）\n\n${readme}` : "项目说明暂不可用，请访问项目地址查看详情。"}`;

  return {
    title: title.slice(0, 200),
    summary: summary.slice(0, 220),
    content,
    sourceUrl,
    author: (meta as GithubMeta & { owner?: { login?: string } }).owner?.login || owner,
    tags: ["开源项目", meta.language || "GitHub", ...topics.slice(0, 3)].filter(Boolean),
  };
}

/* ---------------- X / Twitter ---------------- */

type FxResponse = {
  code?: number;
  tweet?: {
    text?: string;
    author?: { name?: string; screen_name?: string };
    created_at?: string;
    article?: {
      title?: string;
      preview_text?: string;
      content?: { blocks?: { text?: string }[] };
    };
  };
};

/** X 页面本身需要登录，使用公开的 fxtwitter 镜像接口取回推文或长文内容 */
async function fromX(user: string, id: string, sourceUrl: string): Promise<ImportedContent> {
  const raw = await fetchText(`https://api.fxtwitter.com/${user}/status/${id}`, {
    Accept: "application/json",
  });
  const data = JSON.parse(raw) as FxResponse;
  const tweet = data.tweet;
  if (data.code !== 200 || !tweet) throw new Error("无法读取该推文，可能已被删除或设为私密");

  const author = tweet.author?.name || user;
  const screenName = tweet.author?.screen_name || user;
  const header = `作者：${author} (@${screenName})\n发布时间：${tweet.created_at || "未知"}\n原文：${sourceUrl}`;

  if (tweet.article) {
    const blocks = tweet.article.content?.blocks ?? [];
    const body = paragraphs(blocks.map((block) => block.text ?? ""));
    const title = clean(tweet.article.title || "").slice(0, 200) || `${author} 的长文`;
    const summary = clean(tweet.article.preview_text || "").slice(0, 220) || body.slice(0, 180);
    return {
      title,
      summary,
      content: `${header}\n\n${body || summary}`,
      sourceUrl,
      author: screenName || author,
      tags: ["X 长文", author],
    };
  }

  const text = clean(tweet.text || "");
  return {
    title: `${author} 的帖子`.slice(0, 200),
    summary: text.slice(0, 220),
    content: `${header}\n\n${text}`,
    sourceUrl,
    author: screenName || author,
    tags: ["X", author],
  };
}

/* ---------------- 通用网页 ---------------- */

async function fromWebpage(url: string): Promise<ImportedContent> {
  const html = await fetchText(url);
  const $ = load(html);

  $("script, style, nav, footer, header, aside, noscript, iframe").remove();

  const title = clean(
    $("meta[property='og:title']").attr("content") ||
      $("title").first().text() ||
      $("h1").first().text(),
  );
  const summary = clean(
    $("meta[property='og:description']").attr("content") ||
      $("meta[name='description']").attr("content") ||
      "",
  );

  const scope = $("article").length ? $("article") : $("main").length ? $("main") : $("body");
  const bodyParts = scope
    .find("p, h2, h3, li")
    .map((_, el) => $(el).text())
    .get();
  const content = paragraphs(bodyParts) || paragraphs([summary, $("body").text()]);

  if (!title) throw new Error("未能提取到标题，请检查链接是否可访问");

  const hostname = new URL(url).hostname.replace(/^www\./, "");
  const author = clean(
    $("meta[name='author']").attr("content") ||
      $("meta[property='article:author']").attr("content") ||
      hostname,
  );
  return {
    title: title.slice(0, 200),
    summary: (summary || content.slice(0, 180)).slice(0, 220),
    content: content || summary,
    sourceUrl: url,
    author,
    tags: [hostname],
  };
}

/** 根据链接类型分发：GitHub → API + README；X → fxtwitter；其余 → 网页解析 */
export async function importFromUrl(rawUrl: string): Promise<ImportedContent> {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    throw new Error("网址格式不正确，请包含 https:// 前缀");
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("仅支持 http/https 链接");
  }

  const github = url.pathname.match(/^\/([^/]+)\/([^/]+)/);
  if (url.hostname === "github.com" && github) {
    return fromGithub(github[1], github[2].replace(/\.git$/, ""), url.toString());
  }

  const xPost = url.pathname.match(/^\/([^/]+)\/status\/(\d+)/);
  if (["x.com", "www.x.com", "twitter.com", "www.twitter.com"].includes(url.hostname) && xPost) {
    return fromX(xPost[1], xPost[2], url.toString());
  }

  return fromWebpage(url.toString());
}
