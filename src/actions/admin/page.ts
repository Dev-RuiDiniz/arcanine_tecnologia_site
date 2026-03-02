"use server";

import { requirePermission } from "@/lib/auth/guards";
import {
  cmsPagePublishSchema,
  cmsPageUpsertSchema,
  type CmsPagePublishInput,
  type CmsPageUpsertInput,
} from "@/schemas/admin/cms-page";
import {
  getCmsPageBySlug,
  listCmsPages,
  publishCmsPage,
  saveCmsPageDraft,
} from "@/services/page.service";

export const saveCmsPageDraftAction = async (input: CmsPageUpsertInput) => {
  const permissionCheck = await requirePermission("pages:edit");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const parsed = cmsPageUpsertSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Invalid cms page payload",
      issues: parsed.error.flatten(),
    };
  }

  const page = await saveCmsPageDraft(parsed.data);
  return {
    ok: true as const,
    data: page,
  };
};

export const publishCmsPageAction = async (input: CmsPagePublishInput) => {
  const permissionCheck = await requirePermission("pages:edit");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const parsed = cmsPagePublishSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Invalid cms page publish payload",
      issues: parsed.error.flatten(),
    };
  }

  const page = await publishCmsPage(parsed.data.slug);
  return {
    ok: true as const,
    data: page,
  };
};

export const getCmsPageAction = async (slug: string) => {
  const permissionCheck = await requirePermission("pages:view");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const parsed = cmsPagePublishSchema.safeParse({ slug });
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Invalid cms page slug",
      issues: parsed.error.flatten(),
    };
  }

  const page = await getCmsPageBySlug(parsed.data.slug);
  return {
    ok: true as const,
    data: page,
  };
};

export const listCmsPagesAction = async () => {
  const permissionCheck = await requirePermission("pages:view");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const pages = await listCmsPages();
  return {
    ok: true as const,
    data: pages,
  };
};
