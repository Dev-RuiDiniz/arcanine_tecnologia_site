import { z } from "zod";

export const serviceContentSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  name: z.string().min(3).max(120),
  summary: z.string().min(10).max(220),
  heroTitle: z.string().min(10).max(160),
  heroDescription: z.string().min(20).max(500),
  details: z.array(z.string().min(5).max(240)).min(3).max(10),
  seoTitle: z.string().min(10).max(70).optional(),
  seoDescription: z.string().min(30).max(160).optional(),
  published: z.boolean().default(false),
});

export type ServiceContentInput = z.infer<typeof serviceContentSchema>;
