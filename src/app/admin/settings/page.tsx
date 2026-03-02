import { redirect } from "next/navigation";

import { SettingsManager } from "@/components/admin/settings/settings-manager";
import { requirePermission } from "@/lib/auth/guards";
import {
  listAdminUsersWithPermissions,
  loadGeneralSettings,
} from "@/services/settings-admin.service";

export default async function AdminSettingsPage() {
  const permissionCheck = await requirePermission("settings:manage");
  if (!permissionCheck.ok) {
    redirect("/admin");
  }

  const [general, users] = await Promise.all([
    loadGeneralSettings(),
    listAdminUsersWithPermissions(),
  ]);

  return <SettingsManager initialGeneral={general} initialUsers={users} />;
}
