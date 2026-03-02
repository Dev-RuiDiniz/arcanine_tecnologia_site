import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { requirePermission } from "@/lib/auth/guards";
import { generalSettingsSchema } from "@/schemas/admin/settings-admin";
import { loadGeneralSettings, saveGeneralSettings } from "@/services/settings-admin.service";

export async function GET() {
  const permissionCheck = await requirePermission("settings:manage");
  if (!permissionCheck.ok) {
    return NextResponse.json<ApiResult<never>>(
      { ok: false, error: permissionCheck.error },
      { status: permissionCheck.error === "Unauthorized" ? 401 : 403 },
    );
  }

  const settings = await loadGeneralSettings();
  return NextResponse.json<ApiResult<typeof settings>>({
    ok: true,
    data: settings,
  });
}

export async function PUT(request: Request) {
  const permissionCheck = await requirePermission("settings:manage");
  if (!permissionCheck.ok) {
    return NextResponse.json<ApiResult<never>>(
      { ok: false, error: permissionCheck.error },
      { status: permissionCheck.error === "Unauthorized" ? 401 : 403 },
    );
  }

  try {
    const body = await request.json();
    const parsed = generalSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        { ok: false, error: "Invalid general settings payload", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await saveGeneralSettings(parsed.data);
    return NextResponse.json<ApiResult<{ updated: true }>>({
      ok: true,
      data: { updated: true },
    });
  } catch (error) {
    return NextResponse.json<ApiResult<never>>(
      { ok: false, error: error instanceof Error ? error.message : "Unable to save settings" },
      { status: 500 },
    );
  }
}
