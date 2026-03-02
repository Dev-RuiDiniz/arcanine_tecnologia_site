import { redirect } from "next/navigation";

import { CmsPagesEditor } from "@/components/admin/pages/cms-pages-editor";
import { requirePermission } from "@/lib/auth/guards";
import { listCmsPages } from "@/services/page.service";

export default async function AdminPagesPage() {
  const permissionCheck = await requirePermission("pages:view");
  if (!permissionCheck.ok) {
    redirect("/admin");
  }

  const pages = await listCmsPages();

  return <CmsPagesEditor initialPages={pages} />;
}
