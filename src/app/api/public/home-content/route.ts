import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { loadPublicHomeContent } from "@/services/home-content.service";

export async function GET() {
  try {
    const homeContent = await loadPublicHomeContent();
    return NextResponse.json<ApiResult<typeof homeContent>>({
      ok: true,
      data: homeContent,
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unable to load home content",
      },
      { status: 500 },
    );
  }
}
