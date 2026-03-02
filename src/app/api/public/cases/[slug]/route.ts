import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { getPublicCaseBySlug } from "@/services/case-content.service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;
  try {
    const caseContent = await getPublicCaseBySlug(slug);
    if (!caseContent) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Case not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResult<typeof caseContent>>({
      ok: true,
      data: caseContent,
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unable to load case",
      },
      { status: 500 },
    );
  }
}
