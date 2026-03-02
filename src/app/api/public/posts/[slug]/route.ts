import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { getPublicPostBySlug } from "@/services/post.service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;
  const post = await getPublicPostBySlug(slug);
  if (!post) {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Post not found",
      },
      { status: 404 },
    );
  }

  return NextResponse.json<ApiResult<typeof post>>({
    ok: true,
    data: post,
  });
}
