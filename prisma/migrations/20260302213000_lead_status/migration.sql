-- CreateEnum
CREATE TYPE "public"."LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'LOST');

-- AlterTable
ALTER TABLE "public"."Lead"
ADD COLUMN "status" "public"."LeadStatus" NOT NULL DEFAULT 'NEW';
