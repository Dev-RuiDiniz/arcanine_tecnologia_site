import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { loadPublicSiteConfig } from "@/services/site-config.service";

export async function GET() {
  try {
    const siteConfig = await loadPublicSiteConfig();
    return NextResponse.json<ApiResult<typeof siteConfig>>({
      ok: true,
      data: siteConfig,
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unable to load public site configuration",
      },
      { status: 500 },
    );
  }
}
