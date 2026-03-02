import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import type { ApiResult } from "@/lib/api/contracts";
import { requirePermission } from "@/lib/auth/guards";
import { authOptions } from "@/lib/auth/options";
import { leadFiltersSchema, leadStatusUpdateSchema } from "@/schemas/admin/lead-admin";
import { listAdminLeads, updateLeadStatus } from "@/services/lead-admin.service";

export async function GET(request: Request) {
  const permissionCheck = await requirePermission("leads:view");
  if (!permissionCheck.ok) {
    return NextResponse.json<ApiResult<never>>(
      { ok: false, error: permissionCheck.error },
      { status: permissionCheck.error === "Unauthorized" ? 401 : 403 },
    );
  }

  const url = new URL(request.url);
  const parsed = leadFiltersSchema.safeParse({
    dateFrom: url.searchParams.get("dateFrom") || undefined,
    dateTo: url.searchParams.get("dateTo") || undefined,
    status: url.searchParams.get("status") || undefined,
    service: url.searchParams.get("service") || undefined,
    q: url.searchParams.get("q") || undefined,
  });
  if (!parsed.success) {
    return NextResponse.json<ApiResult<never>>(
      { ok: false, error: "Invalid leads filter payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const leads = await listAdminLeads(parsed.data);
  return NextResponse.json<ApiResult<typeof leads>>(
    { ok: true, data: leads },
    {
      headers: {
        "Cache-Control": "private, no-store",
      },
    },
  );
}

export async function PATCH(request: Request) {
  const permissionCheck = await requirePermission("leads:view");
  if (!permissionCheck.ok) {
    return NextResponse.json<ApiResult<never>>(
      { ok: false, error: permissionCheck.error },
      { status: permissionCheck.error === "Unauthorized" ? 401 : 403 },
    );
  }

  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const parsed = leadStatusUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json<ApiResult<never>>(
        { ok: false, error: "Invalid lead status payload", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    await updateLeadStatus({
      leadId: parsed.data.leadId,
      status: parsed.data.status,
      note: parsed.data.note,
      authorEmail: session?.user?.email || undefined,
    });

    return NextResponse.json<ApiResult<{ updated: true }>>({
      ok: true,
      data: { updated: true },
    });
  } catch (error) {
    return NextResponse.json<ApiResult<never>>(
      { ok: false, error: error instanceof Error ? error.message : "Unable to update lead status" },
      { status: 500 },
    );
  }
}
