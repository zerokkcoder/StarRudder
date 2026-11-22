import { NextResponse } from "next/server";
import { fetchRssFeeds } from "@/lib/rss";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await fetchRssFeeds();
  return NextResponse.json(result);
}

export async function GET(request: Request) {
  return POST(request);
}
