import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { listPublicCases } from "@/services/case-content.service";

export async function GET() {
  try {
    const cases = await listPublicCases();
    return NextResponse.json<ApiResult<typeof cases>>({
      ok: true,
      data: cases,
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unable to load cases",
      },
      { status: 500 },
    );
  }
}
