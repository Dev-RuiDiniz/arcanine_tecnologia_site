import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { requirePermission } from "@/lib/auth/guards";
import { aboutContentSchema } from "@/schemas/public/about-content";
import { loadPublicAboutContent, upsertAboutContent } from "@/services/about-content.service";

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

  const content = await loadPublicAboutContent();
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
    const parsed = aboutContentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Invalid about content payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    await upsertAboutContent(parsed.data, true);
    return NextResponse.json<ApiResult<{ updated: true }>>({
      ok: true,
      data: { updated: true },
    });
  } catch {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: "Unable to update about content",
      },
      { status: 500 },
    );
  }
}
