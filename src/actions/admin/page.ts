"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/options";
import { createPageSchema, type CreatePageInput } from "@/schemas/admin/page";
import { createPage, listPages } from "@/services/page.service";

export const createPageAction = async (input: CreatePageInput) => {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      ok: false as const,
      error: "Unauthorized",
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
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return {
      ok: false as const,
      error: "Unauthorized",
    };
  }

  const pages = await listPages();
  return {
    ok: true as const,
    data: pages,
  };
};
