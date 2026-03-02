import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import type { ApiResult } from "@/lib/api/contracts";
import { requirePermission } from "@/lib/auth/guards";
import { authOptions } from "@/lib/auth/options";
import { appLogger } from "@/lib/monitoring/logger";
import { captureException } from "@/lib/monitoring/sentry";
import { generalSettingsSchema } from "@/schemas/admin/settings-admin";
import { registerAdminAuditEvent } from "@/services/admin-audit.service";
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
    appLogger.info("api.admin.settings.general.put.request");
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const parsed = generalSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        { ok: false, error: "Invalid general settings payload", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await saveGeneralSettings(parsed.data);
    await registerAdminAuditEvent({
      action: "settings.general.updated",
      resource: "settings",
      actorEmail: session?.user?.email || undefined,
    });
    return NextResponse.json<ApiResult<{ updated: true }>>({
      ok: true,
      data: { updated: true },
    });
  } catch (error) {
    captureException(error, { context: "api-admin-settings-general-put" });
    appLogger.error("api.admin.settings.general.put.failure", {
      error: error instanceof Error ? error.message : "Unknown settings general update error",
    });
    return NextResponse.json<ApiResult<never>>(
      { ok: false, error: error instanceof Error ? error.message : "Unable to save settings" },
      { status: 500 },
    );
  }
}
