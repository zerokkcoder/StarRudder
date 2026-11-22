import { NextResponse } from "next/server";
import { getSiteBySlug, incrementSiteClicks } from "@/lib/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);

  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  // 记录点击后跳转；失败不影响用户到达目标站
  try {
    await incrementSiteClicks(site.id);
  } catch {
    // 计数失败不影响跳转
  }

  return NextResponse.redirect(site.url, 302);
}
