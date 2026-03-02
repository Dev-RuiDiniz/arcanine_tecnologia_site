-- AlterTable
ALTER TABLE "public"."CaseContent"
ADD COLUMN "ctaLabel" TEXT,
ADD COLUMN "ctaUrl" TEXT;

-- CreateTable
CREATE TABLE "public"."MediaAsset" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "optimizedUrl" TEXT NOT NULL,
    "bytes" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "altText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CaseMedia" (
    "caseId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CaseMedia_pkey" PRIMARY KEY ("caseId","mediaId")
);

-- CreateIndex
CREATE INDEX "CaseMedia_mediaId_idx" ON "public"."CaseMedia"("mediaId");

-- AddForeignKey
ALTER TABLE "public"."CaseMedia" ADD CONSTRAINT "CaseMedia_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "public"."CaseContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CaseMedia" ADD CONSTRAINT "CaseMedia_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
