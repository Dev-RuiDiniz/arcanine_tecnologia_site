"use server";

import { requirePermission } from "@/lib/auth/guards";
import { aboutContentSchema, type AboutContentInput } from "@/schemas/public/about-content";
import { loadPublicAboutContent, upsertAboutContent } from "@/services/about-content.service";

export const getAboutContentAction = async () => {
  const permissionCheck = await requirePermission("pages:view");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const content = await loadPublicAboutContent();
  return {
    ok: true as const,
    data: content,
  };
};

export const saveAboutContentAction = async (input: AboutContentInput) => {
  const permissionCheck = await requirePermission("pages:edit");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const parsed = aboutContentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Invalid about content payload",
      issues: parsed.error.flatten(),
    };
  }

  await upsertAboutContent(parsed.data, true);
  return {
    ok: true as const,
    data: { updated: true },
  };
};
