"use server";

import { requirePermission } from "@/lib/auth/guards";
import { caseContentSchema, type CaseContentInput } from "@/schemas/public/case-content";
import {
  getPublicCaseBySlug,
  listPublicCases,
  upsertCaseContent,
} from "@/services/case-content.service";

export const listCaseContentAction = async () => {
  const permissionCheck = await requirePermission("pages:view");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const cases = await listPublicCases();
  return {
    ok: true as const,
    data: cases,
  };
};

export const getCaseContentBySlugAction = async (slug: string) => {
  const permissionCheck = await requirePermission("pages:view");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const caseContent = await getPublicCaseBySlug(slug);
  return {
    ok: true as const,
    data: caseContent,
  };
};

export const saveCaseContentAction = async (input: CaseContentInput) => {
  const permissionCheck = await requirePermission("pages:edit");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const parsed = caseContentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Invalid case content payload",
      issues: parsed.error.flatten(),
    };
  }

  await upsertCaseContent(parsed.data);
  return {
    ok: true as const,
    data: { updated: true },
  };
};
