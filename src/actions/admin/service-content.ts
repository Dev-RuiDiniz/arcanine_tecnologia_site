"use server";

import { requirePermission } from "@/lib/auth/guards";
import { serviceContentSchema, type ServiceContentInput } from "@/schemas/public/service-content";
import {
  getPublicServiceBySlug,
  listPublicServices,
  upsertServiceContent,
} from "@/services/service-content.service";

export const listServiceContentAction = async () => {
  const permissionCheck = await requirePermission("pages:view");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const services = await listPublicServices();
  return {
    ok: true as const,
    data: services,
  };
};

export const getServiceContentBySlugAction = async (slug: string) => {
  const permissionCheck = await requirePermission("pages:view");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const service = await getPublicServiceBySlug(slug);
  return {
    ok: true as const,
    data: service,
  };
};

export const saveServiceContentAction = async (input: ServiceContentInput) => {
  const permissionCheck = await requirePermission("pages:edit");
  if (!permissionCheck.ok) {
    return {
      ok: false as const,
      error: permissionCheck.error,
    };
  }

  const parsed = serviceContentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Invalid service content payload",
      issues: parsed.error.flatten(),
    };
  }

  await upsertServiceContent(parsed.data);
  return {
    ok: true as const,
    data: { updated: true },
  };
};
