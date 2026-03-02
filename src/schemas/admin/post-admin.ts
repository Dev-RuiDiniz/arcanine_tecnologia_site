import { z } from "zod";

import { postStatusSchema } from "@/schemas/blog/post";

export const postAdminUpsertSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(4).max(160),
  excerpt: z.string().trim().min(20).max(320),
  coverImageUrl: z.string().url().optional(),
  contentHtml: z.string().trim().min(30),
  status: postStatusSchema,
  categoryName: z.string().trim().min(2).max(80),
  categorySlug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  tags: z
    .array(
      z.object({
        name: z.string().trim().min(2).max(40),
        slug: z
          .string()
          .trim()
          .min(2)
          .max(50)
          .regex(/^[a-z0-9-]+$/),
      }),
    )
    .max(12),
});

export const postAdminDeleteSchema = z.object({
  id: z.string().min(2),
});

export const postAdminFiltersSchema = z.object({
  category: z.string().trim().optional(),
  tag: z.string().trim().optional(),
  q: z.string().trim().optional(),
  status: postStatusSchema.optional(),
});

export type PostAdminUpsertInput = z.infer<typeof postAdminUpsertSchema>;
