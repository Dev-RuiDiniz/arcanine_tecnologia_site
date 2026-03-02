import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { listPublicPosts } from "@/services/post.service";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category") || undefined;
  const tag = url.searchParams.get("tag") || undefined;
  const q = url.searchParams.get("q") || undefined;

  const data = await listPublicPosts({ category, tag, q });
  return NextResponse.json<ApiResult<typeof data>>({
    ok: true,
    data,
  });
}
