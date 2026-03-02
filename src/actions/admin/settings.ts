"use server";

import { requirePermission } from "@/lib/auth/guards";
import {
  adminUserPermissionsUpdateSchema,
  generalSettingsSchema,
} from "@/schemas/admin/settings-admin";
import {
  listAdminUsersWithPermissions,
  loadGeneralSettings,
  saveAdminUsersPermissions,
  saveGeneralSettings,
} from "@/services/settings-admin.service";

export const getGeneralSettingsAction = async () => {
  const permissionCheck = await requirePermission("settings:manage");
  if (!permissionCheck.ok) {
    return { ok: false as const, error: permissionCheck.error };
  }
  const settings = await loadGeneralSettings();
  return { ok: true as const, data: settings };
};

export const saveGeneralSettingsAction = async (input: unknown) => {
  const permissionCheck = await requirePermission("settings:manage");
  if (!permissionCheck.ok) {
    return { ok: false as const, error: permissionCheck.error };
  }

  const parsed = generalSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Invalid general settings payload",
      issues: parsed.error.flatten(),
    };
  }

  await saveGeneralSettings(parsed.data);
  return { ok: true as const, data: { updated: true } };
};

export const listAdminUsersPermissionsAction = async () => {
  const permissionCheck = await requirePermission("settings:manage");
  if (!permissionCheck.ok) {
    return { ok: false as const, error: permissionCheck.error };
  }
  const users = await listAdminUsersWithPermissions();
  return { ok: true as const, data: users };
};

export const saveAdminUsersPermissionsAction = async (input: unknown) => {
  const permissionCheck = await requirePermission("settings:manage");
  if (!permissionCheck.ok) {
    return { ok: false as const, error: permissionCheck.error };
  }

  const parsed = adminUserPermissionsUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      error: "Invalid users permissions payload",
      issues: parsed.error.flatten(),
    };
  }

  await saveAdminUsersPermissions(parsed.data);
  return { ok: true as const, data: { updated: true } };
};
