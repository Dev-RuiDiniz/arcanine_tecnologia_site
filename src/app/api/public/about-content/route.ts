import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { loadPublicAboutContent } from "@/services/about-content.service";

export async function GET() {
  try {
    const aboutContent = await loadPublicAboutContent();
    return NextResponse.json<ApiResult<typeof aboutContent>>({
      ok: true,
      data: aboutContent,
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unable to load about content",
      },
      { status: 500 },
    );
  }
}
