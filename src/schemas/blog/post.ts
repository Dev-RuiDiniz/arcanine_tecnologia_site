import { z } from "zod";

export const postStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const blogPostSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  coverImageUrl: z.string().url().optional(),
  contentHtml: z.string(),
  status: postStatusSchema,
  publishedAt: z.string().datetime().optional(),
  category: z
    .object({
      id: z.string(),
      slug: z.string(),
      name: z.string(),
    })
    .optional(),
  tags: z.array(
    z.object({
      id: z.string(),
      slug: z.string(),
      name: z.string(),
    }),
  ),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type BlogPost = z.infer<typeof blogPostSchema>;
