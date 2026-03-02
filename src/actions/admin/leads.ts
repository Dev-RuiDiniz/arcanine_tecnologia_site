"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { requirePermission } from "@/lib/auth/guards";
import { leadFiltersSchema, leadStatusUpdateSchema } from "@/schemas/admin/lead-admin";
import { listAdminLeads, updateLeadStatus } from "@/services/lead-admin.service";

export const listAdminLeadsAction = async (input: unknown) => {
  const permissionCheck = await requirePermission("leads:view");
  if (!permissionCheck.ok) {
    return { ok: false as const, error: permissionCheck.error };
  }

  const parsed = leadFiltersSchema.safeParse(input ?? {});
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Invalid leads filter payload",
      issues: parsed.error.flatten(),
    };
  }

  const leads = await listAdminLeads(parsed.data);
  return { ok: true as const, data: leads };
};

export const updateLeadStatusAction = async (input: unknown) => {
  const permissionCheck = await requirePermission("leads:view");
  if (!permissionCheck.ok) {
    return { ok: false as const, error: permissionCheck.error };
  }

  const parsed = leadStatusUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Invalid lead status payload",
      issues: parsed.error.flatten(),
    };
  }

  const session = await getServerSession(authOptions);
  await updateLeadStatus({
    leadId: parsed.data.leadId,
    status: parsed.data.status,
    note: parsed.data.note,
    authorEmail: session?.user?.email || undefined,
  });
  return { ok: true as const, data: { updated: true } };
};
