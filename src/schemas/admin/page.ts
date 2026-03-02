import { z } from "zod";

export const createPageSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(320).optional(),
  published: z.boolean().optional(),
  content: z.record(z.string(), z.unknown()).optional(),
});

export type CreatePageInput = z.infer<typeof createPageSchema>;
