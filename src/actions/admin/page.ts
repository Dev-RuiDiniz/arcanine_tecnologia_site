"use server";

import { createPageSchema, type CreatePageInput } from "@/schemas/admin/page";
import { createPage, listPages } from "@/services/page.service";

export const createPageAction = async (input: CreatePageInput) => {
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
  const pages = await listPages();
  return {
    ok: true as const,
    data: pages,
  };
};
