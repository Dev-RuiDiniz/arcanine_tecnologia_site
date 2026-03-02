import { z } from "zod";

export const generalSettingsSchema = z.object({
  companyName: z.string().trim().min(2).max(160),
  email: z.string().trim().email(),
  phone: z.string().trim().min(6).max(40),
  whatsapp: z.string().trim().min(6).max(40),
  addressStreet: z.string().trim().min(2).max(200),
  addressCity: z.string().trim().min(2).max(100),
  addressState: z.string().trim().min(2).max(60),
  addressZip: z.string().trim().min(2).max(30),
  addressCountry: z.string().trim().min(2).max(80),
  socialLinksJson: z.string().trim().min(2),
  mapEmbedUrl: z.string().url().optional(),
  integrations: z.object({
    formErrorsWebhookUrl: z.string().url().optional(),
    emailErrorsWebhookUrl: z.string().url().optional(),
    gaId: z.string().optional(),
    plausibleDomain: z.string().optional(),
  }),
});

export const adminUserPermissionSchema = z.object({
  email: z.string().trim().email(),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
  active: z.boolean(),
});

export const adminUserPermissionsUpdateSchema = z.object({
  users: z.array(adminUserPermissionSchema),
});
