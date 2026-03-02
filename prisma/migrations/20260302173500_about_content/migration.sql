-- CreateTable
CREATE TABLE "public"."AboutContent" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'default',
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "historyTitle" TEXT NOT NULL,
    "historyText" TEXT NOT NULL,
    "values" TEXT[],
    "methodology" TEXT[],
    "stack" TEXT[],
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AboutContent_key_key" ON "public"."AboutContent"("key");

