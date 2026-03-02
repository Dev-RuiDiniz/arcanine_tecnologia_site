import { z } from "zod";

export const mediaAssetSchema = z.object({
  id: z.string().min(2).max(80),
  provider: z.string().min(2).max(40),
  storageKey: z.string().min(2).max(240),
  url: z.string().url(),
  optimizedUrl: z.string().url(),
  bytes: z.number().int().nonnegative(),
  mimeType: z.string().min(3).max(120),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  altText: z.string().max(180).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const createMediaAssetSchema = z.object({
  provider: z.string().min(2).max(40),
  storageKey: z.string().min(2).max(240),
  url: z.string().url(),
  optimizedUrl: z.string().url(),
  bytes: z.number().int().nonnegative(),
  mimeType: z.string().min(3).max(120),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  altText: z.string().max(180).optional(),
});

export const deleteMediaAssetSchema = z.object({
  id: z.string().min(2).max(80),
});

export type MediaAssetDto = z.infer<typeof mediaAssetSchema>;
export type CreateMediaAssetInput = z.infer<typeof createMediaAssetSchema>;
