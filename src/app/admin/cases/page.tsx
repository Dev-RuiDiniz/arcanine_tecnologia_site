import { redirect } from "next/navigation";

import { CasesMediaManager } from "@/components/admin/cases/cases-media-manager";
import { requirePermission } from "@/lib/auth/guards";
import { listAdminCases } from "@/services/admin-case.service";
import { listMediaAssets } from "@/services/media.service";

export default async function AdminCasesPage() {
  const permissionCheck = await requirePermission("pages:view");
  if (!permissionCheck.ok) {
    redirect("/admin");
  }

  const [cases, media] = await Promise.all([listAdminCases(), listMediaAssets()]);

  return <CasesMediaManager initialCases={cases} initialMedia={media} />;
}
