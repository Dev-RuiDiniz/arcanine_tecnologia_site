import { z } from "zod";

export const cmsPageSlugSchema = z.enum(["home", "sobre", "servicos"]);

export const cmsPageUpsertSchema = z.object({
  slug: cmsPageSlugSchema,
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(320).optional(),
  content: z.unknown(),
});

export const cmsPagePublishSchema = z.object({
  slug: cmsPageSlugSchema,
});

export type CmsPageSlug = z.infer<typeof cmsPageSlugSchema>;
export type CmsPageUpsertInput = z.infer<typeof cmsPageUpsertSchema>;
export type CmsPagePublishInput = z.infer<typeof cmsPagePublishSchema>;
