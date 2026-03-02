"use server";

import { requirePermission } from "@/lib/auth/guards";
import { createPageSchema, type CreatePageInput } from "@/schemas/admin/page";
import { createPage, listPages } from "@/services/page.service";

export const createPageAction = async (input: CreatePageInput) => {
  const permissionCheck = await requirePermission("pages:edit");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const parsed = createPageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Invalid page payload",
      issues: parsed.error.flatten(),
    };
  }

  const page = await createPage(parsed.data);
  return {
    ok: true as const,
    data: page,
  };
};

export const listPagesAction = async () => {
  const permissionCheck = await requirePermission("pages:view");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const pages = await listPages();
  return {
    ok: true as const,
    data: pages,
  };
};
