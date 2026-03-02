import { randomUUID } from "node:crypto";

import { Prisma } from "@prisma/client";

import type { CreateMediaAssetInput, MediaAssetDto } from "@/schemas/admin/media";

import { prisma } from "@/lib/db/prisma";

type MediaAssetRow = {
  id: string;
  provider: string;
  storageKey: string;
  url: string;
  optimizedUrl: string;
  bytes: number;
  mimeType: string;
  width: number | null;
  height: number | null;
  altText: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const toDto = (row: MediaAssetRow): MediaAssetDto => ({
  id: row.id,
  provider: row.provider,
  storageKey: row.storageKey,
  url: row.url,
  optimizedUrl: row.optimizedUrl,
  bytes: Number(row.bytes),
  mimeType: row.mimeType,
  width: row.width ?? undefined,
  height: row.height ?? undefined,
  altText: row.altText ?? undefined,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
});

export const listMediaAssets = async (): Promise<MediaAssetDto[]> => {
  const rows = await prisma.$queryRaw<MediaAssetRow[]>(Prisma.sql`
    SELECT
      "id", "provider", "storageKey", "url", "optimizedUrl",
      "bytes", "mimeType", "width", "height", "altText",
      "createdAt", "updatedAt"
    FROM "public"."MediaAsset"
    ORDER BY "createdAt" DESC
  `);
  return rows.map(toDto);
};

export const createMediaAsset = async (input: CreateMediaAssetInput): Promise<MediaAssetDto> => {
  const id = randomUUID();
  const rows = await prisma.$queryRaw<MediaAssetRow[]>(Prisma.sql`
    INSERT INTO "public"."MediaAsset" (
      "id", "provider", "storageKey", "url", "optimizedUrl",
      "bytes", "mimeType", "width", "height", "altText", "updatedAt"
    )
    VALUES (
      ${id}, ${input.provider}, ${input.storageKey}, ${input.url}, ${input.optimizedUrl},
      ${input.bytes}, ${input.mimeType}, ${input.width ?? null}, ${input.height ?? null},
      ${input.altText ?? null}, NOW()
    )
    RETURNING
      "id", "provider", "storageKey", "url", "optimizedUrl",
      "bytes", "mimeType", "width", "height", "altText",
      "createdAt", "updatedAt"
  `);

  return toDto(rows[0]);
};

export const deleteMediaAssetById = async (id: string): Promise<void> => {
  await prisma.$executeRaw(Prisma.sql`DELETE FROM "public"."MediaAsset" WHERE "id" = ${id}`);
};
