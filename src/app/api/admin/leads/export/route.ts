import { NextResponse } from "next/server";

import { requirePermission } from "@/lib/auth/guards";
import { leadFiltersSchema } from "@/schemas/admin/lead-admin";
import { buildLeadsCsv, listAdminLeads } from "@/services/lead-admin.service";

export async function GET(request: Request) {
  const permissionCheck = await requirePermission("leads:view");
  if (!permissionCheck.ok) {
    return NextResponse.json(
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
    return NextResponse.json(
      { ok: false, error: "Invalid leads export filter payload", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const leads = await listAdminLeads(parsed.data);
  const csv = buildLeadsCsv(leads);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="leads-export.csv"',
      "Cache-Control": "private, no-store",
    },
  });
}
