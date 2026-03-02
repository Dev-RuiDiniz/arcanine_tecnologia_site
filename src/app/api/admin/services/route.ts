import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { requirePermission } from "@/lib/auth/guards";
import { serviceContentSchema } from "@/schemas/public/service-content";
import { listPublicServices, upsertServiceContent } from "@/services/service-content.service";

export async function GET() {
  const permissionCheck = await requirePermission("pages:view");
  if (!permissionCheck.ok) {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: permissionCheck.error,
      },
      { status: permissionCheck.error === "Unauthorized" ? 401 : 403 },
    );
  }

  const services = await listPublicServices();
  return NextResponse.json<ApiResult<typeof services>>({
    ok: true,
    data: services,
  });
}

export async function POST(request: Request) {
  const permissionCheck = await requirePermission("pages:edit");
  if (!permissionCheck.ok) {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: permissionCheck.error,
      },
      { status: permissionCheck.error === "Unauthorized" ? 401 : 403 },
    );
  }

  try {
    const body = await request.json();
    const parsed = serviceContentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Invalid service content payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    await upsertServiceContent(parsed.data);
    return NextResponse.json<ApiResult<{ updated: true }>>({
      ok: true,
      data: { updated: true },
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unable to save service content",
      },
      { status: 500 },
    );
  }
}
