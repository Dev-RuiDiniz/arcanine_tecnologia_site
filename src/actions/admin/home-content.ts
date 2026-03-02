"use server";

import { requirePermission } from "@/lib/auth/guards";
import { homeContentSchema, type HomeContentInput } from "@/schemas/public/home-content";
import { loadPublicHomeContent, upsertHomeContent } from "@/services/home-content.service";

export const getHomeContentAction = async () => {
  const permissionCheck = await requirePermission("pages:view");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const content = await loadPublicHomeContent();
  return {
    ok: true as const,
    data: content,
  };
};

export const saveHomeContentAction = async (input: HomeContentInput) => {
  const permissionCheck = await requirePermission("pages:edit");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const parsed = homeContentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Invalid home content payload",
      issues: parsed.error.flatten(),
    };
  }

  await upsertHomeContent(parsed.data, true);
  return {
    ok: true as const,
    data: { updated: true },
  };
};
