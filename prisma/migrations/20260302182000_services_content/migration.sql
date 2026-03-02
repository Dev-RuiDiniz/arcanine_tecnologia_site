-- CreateTable
CREATE TABLE "public"."ServiceContent" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "details" TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServiceContent_slug_key" ON "public"."ServiceContent"("slug");

