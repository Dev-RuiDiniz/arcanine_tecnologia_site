import { Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

import { getAuthUsersFromEnv } from "@/lib/auth/users";
import type { AppRole } from "@/lib/auth/rbac";
import type { z } from "zod";

import {
  adminUserPermissionsUpdateSchema,
  generalSettingsSchema,
} from "@/schemas/admin/settings-admin";
import { prisma } from "@/lib/db/prisma";
import { getGlobalSiteInfo } from "@/lib/site/global-site-info";

type GeneralSettingsInput = z.infer<typeof generalSettingsSchema>;
type AdminUsersUpdateInput = z.infer<typeof adminUserPermissionsUpdateSchema>;

type AppSettingRow = {
  key: string;
  value: unknown;
};

type AdminUserPermissionRow = {
  id: string;
  email: string;
  role: AppRole;
  active: boolean;
};

type StoredGeneralSettings = GeneralSettingsInput;

const GENERAL_SETTINGS_KEY = "general_settings";

const getStoredGeneralSettings = async (): Promise<StoredGeneralSettings | null> => {
  const rows = await prisma.$queryRaw<AppSettingRow[]>(Prisma.sql`
    SELECT "key", "value"
    FROM "public"."AppSetting"
    WHERE "key" = ${GENERAL_SETTINGS_KEY}
    LIMIT 1
  `);
  if (rows.length === 0) {
    return null;
  }

  const value = rows[0].value as StoredGeneralSettings;
  return value;
};

export const loadGeneralSettings = async (): Promise<GeneralSettingsInput> => {
  const env = getGlobalSiteInfo();
  const fallback: GeneralSettingsInput = {
    companyName: env.companyName,
    email: env.email,
    phone: env.phone,
    whatsapp: env.whatsapp,
    addressStreet: env.address.street,
    addressCity: env.address.city,
    addressState: env.address.state,
    addressZip: env.address.zipCode,
    addressCountry: env.address.country,
    socialLinksJson: JSON.stringify(env.socials),
    mapEmbedUrl: env.mapEmbedUrl,
    integrations: {
      formErrorsWebhookUrl: process.env.FORM_ERRORS_WEBHOOK_URL,
      emailErrorsWebhookUrl: process.env.EMAIL_DELIVERY_ERRORS_WEBHOOK_URL,
      gaId: process.env.NEXT_PUBLIC_GA_ID,
      plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
    },
  };

  try {
    const stored = await getStoredGeneralSettings();
    return stored || fallback;
  } catch {
    return fallback;
  }
};

export const saveGeneralSettings = async (input: GeneralSettingsInput) => {
  const exists = await prisma.$queryRaw<{ key: string }[]>(Prisma.sql`
    SELECT "key" FROM "public"."AppSetting" WHERE "key" = ${GENERAL_SETTINGS_KEY} LIMIT 1
  `);

  if (exists.length > 0) {
    await prisma.$executeRaw(Prisma.sql`
      UPDATE "public"."AppSetting"
      SET "value" = ${input}::jsonb, "updatedAt" = NOW()
      WHERE "key" = ${GENERAL_SETTINGS_KEY}
    `);
  } else {
    await prisma.$executeRaw(Prisma.sql`
      INSERT INTO "public"."AppSetting" ("key", "value", "updatedAt")
      VALUES (${GENERAL_SETTINGS_KEY}, ${input}::jsonb, NOW())
    `);
  }
};

const loadDbAdminUserPermissions = async () => {
  return prisma.$queryRaw<AdminUserPermissionRow[]>(Prisma.sql`
    SELECT "id", "email", "role", "active"
    FROM "public"."AdminUserPermission"
    ORDER BY "email" ASC
  `);
};

export const listAdminUsersWithPermissions = async () => {
  const envUsers = getAuthUsersFromEnv();
  const dbUsers = await loadDbAdminUserPermissions();
  const byEmail = new Map(dbUsers.map((user) => [user.email.toLowerCase(), user]));

  return envUsers.map((envUser) => {
    const override = byEmail.get(envUser.email.toLowerCase());
    return {
      id: override?.id || envUser.id,
      email: envUser.email,
      sourceRole: envUser.role,
      role: override?.role || envUser.role,
      active: override?.active ?? true,
      name: envUser.name,
    };
  });
};

export const saveAdminUsersPermissions = async (input: AdminUsersUpdateInput) => {
  for (const user of input.users) {
    const existing = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT "id" FROM "public"."AdminUserPermission" WHERE "email" = ${user.email} LIMIT 1
    `);

    if (existing.length > 0) {
      await prisma.$executeRaw(Prisma.sql`
        UPDATE "public"."AdminUserPermission"
        SET "role" = ${user.role}::"public"."RoleName", "active" = ${user.active}, "updatedAt" = NOW()
        WHERE "id" = ${existing[0].id}
      `);
    } else {
      await prisma.$executeRaw(Prisma.sql`
        INSERT INTO "public"."AdminUserPermission" ("id", "email", "role", "active", "updatedAt")
        VALUES (${randomUUID()}, ${user.email}, ${user.role}::"public"."RoleName", ${user.active}, NOW())
      `);
    }
  }
};

export const resolveAdminUserPermissionOverride = async (email: string) => {
  const rows = await prisma.$queryRaw<AdminUserPermissionRow[]>(Prisma.sql`
    SELECT "id", "email", "role", "active"
    FROM "public"."AdminUserPermission"
    WHERE LOWER("email") = LOWER(${email})
    LIMIT 1
  `);
  return rows[0] || null;
};
