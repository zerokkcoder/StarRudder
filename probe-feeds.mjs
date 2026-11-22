import Parser from "rss-parser";
const parser = new Parser({ timeout: 9000, headers: { "User-Agent": "Mozilla/5.0" } });
const feeds = [
  ["[开发] OSCHINA", "https://www.oschina.net/news/rss"],
  ["[开发] InfoQ中文", "https://www.infoq.cn/feed"],
  ["[开发] 掘金", "https://juejin.cn/rss"],
  ["[开发] SegmentFault", "https://segmentfault.com/feeds/blogs"],
  ["[开发] SmashingMag", "https://www.smashingmagazine.com/feed/"],
  ["[开发] AListApart", "https://alistapart.com/main/feed/"],
  ["[AI] 量子位", "https://www.qbitai.com/feed"],
  ["[AI] 机器之心2", "https://www.jiqizhixin.com/rss.xml"],
  ["[AI] 新智元", "https://www.aiera.com.cn/feed"],
  ["[AI] HuggingFace", "https://huggingface.co/blog/feed.xml"],
  ["[AI] OpenAI", "https://openai.com/blog/rss.xml"],
  ["[AI] arXiv cs.AI", "https://export.arxiv.org/rss/cs.AI"],
  ["[AI] Google AI", "https://blog.google/technology/ai/rss/"],
  ["[游戏] 机核", "https://www.gcores.com/rss"],
  ["[游戏] indienova", "https://indienova.com/rss"],
  ["[游戏] 游戏葡萄", "https://youxiputao.com/feed"],
  ["[游戏] Gamelook", "http://www.gamelook.com.cn/feed"],
  ["[游戏] GameDeveloper", "https://www.gamedeveloper.com/rss.xml"],
  ["[游戏] Unity Blog", "https://blog.unity.com/feed"],
  ["[设计] 少数派", "https://sspai.com/feed"],
  ["[设计] 优设网", "https://www.uisdc.com/feed"],
  ["[设计] 设计癖", "http://www.shejipi.com/feed"],
  ["[设计] ProductHunt", "https://www.producthunt.com/feed"],
  ["[设计] UXCollective", "https://uxdesign.cc/feed"],
];
for (const [name, url] of feeds) {
  try {
    const f = await parser.parseURL(url);
    console.log("OK", name, "items", f.items?.length, "sample", (f.items?.[0]?.title || "").slice(0, 45).replace(/\s+/g, " "));
  } catch (e) {
    console.log("ERR", name, String(e.message).split("\n")[0].slice(0, 70));
  }
}
