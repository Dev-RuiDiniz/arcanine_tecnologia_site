import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { getPublicServiceBySlug } from "@/services/service-content.service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;

  try {
    const service = await getPublicServiceBySlug(slug);
    if (!service) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Service not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json<ApiResult<typeof service>>({
      ok: true,
      data: service,
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unable to load service",
      },
      { status: 500 },
    );
  }
}
