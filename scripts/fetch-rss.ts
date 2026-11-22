import { fetchRssFeeds } from "../lib/rss";

async function main() {
  const result = await fetchRssFeeds();
  console.log(`RSS 抓取完成：${result.sources} 个源，新增 ${result.added} 条`);
  for (const error of result.errors) {
    console.warn(`  [${error.name}] ${error.message}`);
  }
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
