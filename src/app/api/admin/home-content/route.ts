import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { requirePermission } from "@/lib/auth/guards";
import { homeContentSchema } from "@/schemas/public/home-content";
import { loadPublicHomeContent, upsertHomeContent } from "@/services/home-content.service";

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

  const content = await loadPublicHomeContent();
  return NextResponse.json<ApiResult<typeof content>>({
    ok: true,
    data: content,
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
    const parsed = homeContentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Invalid home content payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    await upsertHomeContent(parsed.data, true);
    return NextResponse.json<ApiResult<{ updated: true }>>({
      ok: true,
      data: { updated: true },
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unable to update home content",
      },
      { status: 500 },
    );
  }
}
