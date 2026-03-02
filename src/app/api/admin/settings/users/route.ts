import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { requirePermission } from "@/lib/auth/guards";
import { adminUserPermissionsUpdateSchema } from "@/schemas/admin/settings-admin";
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
    const body = await request.json();
    const parsed = adminUserPermissionsUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        { ok: false, error: "Invalid users permissions payload", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await saveAdminUsersPermissions(parsed.data);
    return NextResponse.json<ApiResult<{ updated: true }>>({
      ok: true,
      data: { updated: true },
    });
  } catch (error) {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to update users permissions",
      },
      { status: 500 },
    );
  }
}
