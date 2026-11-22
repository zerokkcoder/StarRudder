import { backfillRssContent } from "../lib/rss";

async function main() {
  const result = await backfillRssContent();
  console.log(`聚合内容补全：检查 ${result.total} 条，补全 ${result.filled} 条`);
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
