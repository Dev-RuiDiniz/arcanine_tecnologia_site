import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { requirePermission } from "@/lib/auth/guards";
import { caseAdminSchema, deleteCaseAdminSchema } from "@/schemas/admin/case-admin";
import { deleteAdminCaseById, listAdminCases, saveAdminCase } from "@/services/admin-case.service";

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

  const cases = await listAdminCases();
  return NextResponse.json<ApiResult<typeof cases>>({
    ok: true,
    data: cases,
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
    const parsed = caseAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Invalid case payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const saved = await saveAdminCase(parsed.data);
    return NextResponse.json<ApiResult<typeof saved>>({
      ok: true,
      data: saved,
    });
  } catch (error) {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to save case content",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
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
    const parsed = deleteCaseAdminSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        {
          ok: false,
          error: "Invalid case delete payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    await deleteAdminCaseById(parsed.data.id);
    return NextResponse.json<ApiResult<{ deleted: true }>>({
      ok: true,
      data: { deleted: true },
    });
  } catch (error) {
    return NextResponse.json<ApiResult<never>>(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unable to delete case",
      },
      { status: 500 },
    );
  }
}
