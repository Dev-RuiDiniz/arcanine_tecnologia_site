import { randomUUID } from "node:crypto";

import { Prisma } from "@prisma/client";

import type { CaseAdminInput } from "@/schemas/admin/case-admin";
import type { MediaAssetDto } from "@/schemas/admin/media";

import { prisma } from "@/lib/db/prisma";

type CaseRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
  results: string[];
  stack: string[];
  imageUrls: string[];
  testimonialQuote: string | null;
  testimonialAuthor: string | null;
  testimonialRole: string | null;
  showTestimonial: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
  updatedAt: Date;
};

type CaseMediaRow = {
  caseId: string;
  mediaId: string;
  position: number;
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

export type AdminCaseDto = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  ctaLabel?: string;
  ctaUrl?: string;
  results: string[];
  stack: string[];
  imageUrls: string[];
  mediaIds: string[];
  media: MediaAssetDto[];
  testimonialQuote?: string;
  testimonialAuthor?: string;
  testimonialRole?: string;
  showTestimonial: boolean;
  seoTitle?: string;
  seoDescription?: string;
  published: boolean;
  updatedAt: string;
};

const toMediaDto = (row: CaseMediaRow): MediaAssetDto => ({
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

const buildCaseDto = (row: CaseRow, mediaRows: CaseMediaRow[]): AdminCaseDto => {
  const sortedMediaRows = mediaRows.sort((a, b) => a.position - b.position);
  const media = sortedMediaRows.map(toMediaDto);
  const mediaIds = media.map((item) => item.id);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    challenge: row.challenge,
    solution: row.solution,
    ctaLabel: row.ctaLabel ?? undefined,
    ctaUrl: row.ctaUrl ?? undefined,
    results: row.results,
    stack: row.stack,
    imageUrls: media.length > 0 ? media.map((item) => item.optimizedUrl) : row.imageUrls,
    mediaIds,
    media,
    testimonialQuote: row.testimonialQuote ?? undefined,
    testimonialAuthor: row.testimonialAuthor ?? undefined,
    testimonialRole: row.testimonialRole ?? undefined,
    showTestimonial: row.showTestimonial,
    seoTitle: row.seoTitle ?? undefined,
    seoDescription: row.seoDescription ?? undefined,
    published: row.published,
    updatedAt: row.updatedAt.toISOString(),
  };
};

const loadCaseMediaRows = async (caseIds: string[]): Promise<CaseMediaRow[]> => {
  if (caseIds.length === 0) {
    return [];
  }

  return prisma.$queryRaw<CaseMediaRow[]>(Prisma.sql`
    SELECT
      cm."caseId",
      cm."mediaId",
      cm."position",
      m."id",
      m."provider",
      m."storageKey",
      m."url",
      m."optimizedUrl",
      m."bytes",
      m."mimeType",
      m."width",
      m."height",
      m."altText",
      m."createdAt",
      m."updatedAt"
    FROM "public"."CaseMedia" cm
    JOIN "public"."MediaAsset" m ON m."id" = cm."mediaId"
    WHERE cm."caseId" IN (${Prisma.join(caseIds)})
    ORDER BY cm."position" ASC
  `);
};

export const listAdminCases = async (): Promise<AdminCaseDto[]> => {
  const caseRows = await prisma.$queryRaw<CaseRow[]>(Prisma.sql`
    SELECT
      "id", "slug", "title", "summary", "challenge", "solution",
      "ctaLabel", "ctaUrl", "results", "stack", "imageUrls",
      "testimonialQuote", "testimonialAuthor", "testimonialRole",
      "showTestimonial", "seoTitle", "seoDescription", "published", "updatedAt"
    FROM "public"."CaseContent"
    ORDER BY "updatedAt" DESC
  `);

  const mediaRows = await loadCaseMediaRows(caseRows.map((row) => row.id));
  const mediaByCaseId = mediaRows.reduce<Record<string, CaseMediaRow[]>>((acc, row) => {
    if (!acc[row.caseId]) {
      acc[row.caseId] = [];
    }
    acc[row.caseId].push(row);
    return acc;
  }, {});

  return caseRows.map((row) => buildCaseDto(row, mediaByCaseId[row.id] || []));
};

export const saveAdminCase = async (input: CaseAdminInput): Promise<AdminCaseDto> => {
  const caseId = await prisma.$transaction(async (tx) => {
    const existing = input.id
      ? await tx.$queryRaw<{ id: string }[]>(
          Prisma.sql`SELECT "id" FROM "public"."CaseContent" WHERE "id" = ${input.id} LIMIT 1`,
        )
      : await tx.$queryRaw<{ id: string }[]>(
          Prisma.sql`SELECT "id" FROM "public"."CaseContent" WHERE "slug" = ${input.slug} LIMIT 1`,
        );

    const resolvedCaseId = existing[0]?.id || randomUUID();

    const mediaRows = input.mediaIds.length
      ? await tx.$queryRaw<{ id: string; optimizedUrl: string }[]>(Prisma.sql`
          SELECT "id", "optimizedUrl"
          FROM "public"."MediaAsset"
          WHERE "id" IN (${Prisma.join(input.mediaIds)})
        `)
      : [];

    const orderedImageUrls = input.mediaIds
      .map((mediaId) => mediaRows.find((row) => row.id === mediaId)?.optimizedUrl)
      .filter((url): url is string => Boolean(url));

    if (existing.length > 0) {
      await tx.$executeRaw(Prisma.sql`
        UPDATE "public"."CaseContent"
        SET
          "slug" = ${input.slug},
          "title" = ${input.title},
          "summary" = ${input.summary},
          "challenge" = ${input.challenge},
          "solution" = ${input.solution},
          "ctaLabel" = ${input.ctaLabel ?? null},
          "ctaUrl" = ${input.ctaUrl ?? null},
          "results" = ${input.results},
          "stack" = ${input.stack},
          "imageUrls" = ${orderedImageUrls},
          "testimonialQuote" = ${input.testimonialQuote ?? null},
          "testimonialAuthor" = ${input.testimonialAuthor ?? null},
          "testimonialRole" = ${input.testimonialRole ?? null},
          "showTestimonial" = ${input.showTestimonial},
          "seoTitle" = ${input.seoTitle ?? null},
          "seoDescription" = ${input.seoDescription ?? null},
          "published" = ${input.published},
          "updatedAt" = NOW()
        WHERE "id" = ${resolvedCaseId}
      `);
    } else {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "public"."CaseContent" (
          "id", "slug", "title", "summary", "challenge", "solution",
          "ctaLabel", "ctaUrl", "results", "stack", "imageUrls",
          "testimonialQuote", "testimonialAuthor", "testimonialRole", "showTestimonial",
          "seoTitle", "seoDescription", "published", "updatedAt"
        )
        VALUES (
          ${resolvedCaseId}, ${input.slug}, ${input.title}, ${input.summary},
          ${input.challenge}, ${input.solution}, ${input.ctaLabel ?? null},
          ${input.ctaUrl ?? null}, ${input.results}, ${input.stack}, ${orderedImageUrls},
          ${input.testimonialQuote ?? null}, ${input.testimonialAuthor ?? null},
          ${input.testimonialRole ?? null}, ${input.showTestimonial},
          ${input.seoTitle ?? null}, ${input.seoDescription ?? null},
          ${input.published}, NOW()
        )
      `);
    }

    await tx.$executeRaw(
      Prisma.sql`DELETE FROM "public"."CaseMedia" WHERE "caseId" = ${resolvedCaseId}`,
    );

    for (let index = 0; index < input.mediaIds.length; index += 1) {
      await tx.$executeRaw(Prisma.sql`
        INSERT INTO "public"."CaseMedia" ("caseId", "mediaId", "position")
        VALUES (${resolvedCaseId}, ${input.mediaIds[index]}, ${index})
      `);
    }

    return resolvedCaseId;
  });

  const allCases = await listAdminCases();
  return allCases.find((item) => item.id === caseId) as AdminCaseDto;
};

export const deleteAdminCaseById = async (id: string): Promise<void> => {
  await prisma.$executeRaw(Prisma.sql`DELETE FROM "public"."CaseContent" WHERE "id" = ${id}`);
};
