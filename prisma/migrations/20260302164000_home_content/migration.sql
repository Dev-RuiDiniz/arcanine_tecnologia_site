-- CreateTable
CREATE TABLE "public"."HomeContent" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL DEFAULT 'default',
    "heroEyebrow" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "ctaBudgetLabel" TEXT NOT NULL,
    "ctaWhatsappLabel" TEXT NOT NULL,
    "services" TEXT[],
    "differentials" TEXT[],
    "featuredCases" JSONB NOT NULL,
    "testimonials" JSONB,
    "showTestimonials" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomeContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomeContent_key_key" ON "public"."HomeContent"("key");

