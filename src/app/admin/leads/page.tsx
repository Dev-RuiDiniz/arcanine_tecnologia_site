import { redirect } from "next/navigation";

import { LeadsManager } from "@/components/admin/leads/leads-manager";
import { requirePermission } from "@/lib/auth/guards";
import { listAdminLeads } from "@/services/lead-admin.service";

export default async function AdminLeadsPage() {
  const permissionCheck = await requirePermission("leads:view");
  if (!permissionCheck.ok) {
    redirect("/admin");
  }

  const leads = await listAdminLeads();
  return <LeadsManager initialLeads={leads} />;
}
