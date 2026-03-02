import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { listPublicServices } from "@/services/service-content.service";

export async function GET() {
  try {
    const services = await listPublicServices();
    return NextResponse.json<ApiResult<typeof services>>({
      ok: true,
      data: services,
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unable to load services",
      },
      { status: 500 },
    );
  }
}
