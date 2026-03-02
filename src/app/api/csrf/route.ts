import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { ensureCsrfCookie } from "@/lib/security/csrf";

export async function GET() {
  const token = await ensureCsrfCookie();

  return NextResponse.json<ApiResult<{ token: string }>>(
    {
      ok: true,
      data: { token },
    },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}
