import { load } from "cheerio";

export type ImportedContent = {
  title: string;
  summary: string;
  content: string;
  sourceUrl: string;
  tags: string[];
};

function clean(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\u200b/g, "")
    .trim();
}

function paragraphs(parts: string[]) {
  return parts.map(clean).filter((p) => p.length > 1).slice(0, 200).join("\n\n").slice(0, 20000);
}

function markdownToText(md: string) {
  const blocks = md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^[\s>*_-]+/gm, "")
    .split(/\n\s*\n/);
  return paragraphs(blocks);
}

async function fetchText(url: string, headers: Record<string, string> = {}) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "StarRudder Content Importer/1.0 (+https://starrudder.cc)",
      ...headers,
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`抓取失败：HTTP ${response.status}`);
  return response.text();
}

/** 从 GitHub 仓库页提取名称、描述与 README */
async function fromGithub(owner: string, repo: string, sourceUrl: string): Promise<ImportedContent> {
  const api = `https://api.github.com/repos/${owner}/${repo}`;
  const [metaRaw, readmeRaw] = await Promise.all([
    fetchText(api, { Accept: "application/vnd.github+json" }).catch(() => "{}"),
    fetchText(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/README.md`).catch(() => ""),
  ]);

  let meta: { name?: string; description?: string | null; language?: string | null } = {};
  try {
    meta = JSON.parse(metaRaw);
  } catch {
    // 忽略解析失败，使用 URL 中的仓库名
  }

  const title = meta.name || repo;
  const summary = clean(meta.description || `开源项目 ${owner}/${repo}`);
  const content = readmeRaw
    ? markdownToText(readmeRaw)
    : `${summary}\n\n项目地址：${sourceUrl}`;
  const tags = ["开源项目", meta.language || "GitHub"].filter(Boolean);

  return { title, summary, content: content || summary, sourceUrl, tags };
}

/** 从任意网页链接提取标题、摘要与正文纯文本 */
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
  return {
    title: title.slice(0, 200),
    summary: (summary || content.slice(0, 180)).slice(0, 220),
    content: content || summary,
    sourceUrl: url,
    tags: [hostname],
  };
}

/** 根据链接类型抓取内容：GitHub 仓库走 API + README，其余走网页解析 */
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
  return fromWebpage(url.toString());
}
