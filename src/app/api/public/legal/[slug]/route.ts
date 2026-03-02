import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { loadLegalPageBySlug } from "@/services/legal-pages.service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;
  if (slug !== "politica-de-privacidade" && slug !== "termos-de-uso") {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Legal page not found",
      },
      { status: 404 },
    );
  }

  const content = await loadLegalPageBySlug(slug);
  return NextResponse.json<ApiResult<typeof content>>({
    ok: true,
    data: content,
  });
}
