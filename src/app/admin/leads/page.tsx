import { redirect } from "next/navigation";

import { requirePermission } from "@/lib/auth/guards";

export default async function AdminLeadsPage() {
  const permissionCheck = await requirePermission("leads:view");
  if (!permissionCheck.ok) {
    redirect("/admin");
  }

  return (
    <section className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
      <h2 className="text-lg font-semibold text-zinc-900">Leads</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Visualizacao de leads disponivel conforme politica de RBAC.
      </p>
    </section>
  );
}
