import { z } from "zod";

export const caseAdminSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().min(4).max(140),
  summary: z.string().min(20).max(260),
  challenge: z.string().min(30).max(800),
  solution: z.string().min(30).max(1000),
  ctaLabel: z.string().min(2).max(60).optional(),
  ctaUrl: z.string().url().optional(),
  results: z.array(z.string().min(3).max(180)).min(2).max(10),
  stack: z.array(z.string().min(2).max(50)).min(2).max(20),
  mediaIds: z.array(z.string().min(2).max(80)).max(24),
  testimonialQuote: z.string().min(10).max(360).optional(),
  testimonialAuthor: z.string().min(2).max(120).optional(),
  testimonialRole: z.string().min(2).max(120).optional(),
  showTestimonial: z.boolean().default(false),
  seoTitle: z.string().min(10).max(70).optional(),
  seoDescription: z.string().min(30).max(160).optional(),
  published: z.boolean().default(false),
});

export const deleteCaseAdminSchema = z.object({
  id: z.string().min(2).max(80),
});

export type CaseAdminInput = z.infer<typeof caseAdminSchema>;
