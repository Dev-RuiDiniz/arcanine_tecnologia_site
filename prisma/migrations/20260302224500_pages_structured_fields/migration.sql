-- CreateEnum
CREATE TYPE "public"."PageContentKind" AS ENUM ('GENERIC', 'HOME', 'ABOUT', 'SERVICES');

-- AlterTable
ALTER TABLE "public"."Page"
ADD COLUMN "contentKind" "public"."PageContentKind" NOT NULL DEFAULT 'GENERIC',
ADD COLUMN "schemaVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "draftContent" JSONB,
ADD COLUMN "publishedContent" JSONB;

-- Backfill
UPDATE "public"."Page"
SET "contentKind" = CASE
  WHEN "slug" = 'home' THEN 'HOME'::"public"."PageContentKind"
  WHEN "slug" = 'sobre' THEN 'ABOUT'::"public"."PageContentKind"
  WHEN "slug" = 'servicos' THEN 'SERVICES'::"public"."PageContentKind"
  ELSE 'GENERIC'::"public"."PageContentKind"
END,
"draftContent" = "content",
"publishedContent" = "content";
