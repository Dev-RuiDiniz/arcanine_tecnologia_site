import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import type { ApiResult } from "@/lib/api/contracts";
import { requirePermission } from "@/lib/auth/guards";
import { authOptions } from "@/lib/auth/options";
import { appLogger } from "@/lib/monitoring/logger";
import { captureException } from "@/lib/monitoring/sentry";
import { adminUserPermissionsUpdateSchema } from "@/schemas/admin/settings-admin";
import { registerAdminAuditEvent } from "@/services/admin-audit.service";
import {
  listAdminUsersWithPermissions,
  saveAdminUsersPermissions,
} from "@/services/settings-admin.service";

export async function GET() {
  const permissionCheck = await requirePermission("settings:manage");
  if (!permissionCheck.ok) {
    return NextResponse.json<ApiResult<never>>(
      { ok: false, error: permissionCheck.error },
      { status: permissionCheck.error === "Unauthorized" ? 401 : 403 },
    );
  }

  const users = await listAdminUsersWithPermissions();
  return NextResponse.json<ApiResult<typeof users>>({
    ok: true,
    data: users,
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
    appLogger.info("api.admin.settings.users.put.request");
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const parsed = adminUserPermissionsUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        { ok: false, error: "Invalid users permissions payload", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await saveAdminUsersPermissions(parsed.data);
    await registerAdminAuditEvent({
      action: "settings.users-permissions.updated",
      resource: "settings",
      actorEmail: session?.user?.email || undefined,
      details: {
        users: parsed.data.users.map((user) => ({
          email: user.email,
          role: user.role,
          active: user.active,
        })),
      },
    });
    return NextResponse.json<ApiResult<{ updated: true }>>({
      ok: true,
      data: { updated: true },
    });
  } catch (error) {
    captureException(error, { context: "api-admin-settings-users-put" });
    appLogger.error("api.admin.settings.users.put.failure", {
      error: error instanceof Error ? error.message : "Unknown users permissions update error",
    });
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to update users permissions",
      },
      { status: 500 },
    );
  }
}
