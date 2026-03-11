/*
  Warnings:

  - You are about to drop the column `highlightTags` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "highlightTags",
ADD COLUMN     "extentionDescription" TEXT,
ADD COLUMN     "extentionImages" JSONB,
ADD COLUMN     "floorplans" JSONB,
ADD COLUMN     "gallery" JSONB,
ADD COLUMN     "heroImage" TEXT,
ADD COLUMN     "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "intro" TEXT,
ADD COLUMN     "locationDescription" TEXT,
ADD COLUMN     "locationText" TEXT,
ADD COLUMN     "mapEmbedUrl" TEXT,
ADD COLUMN     "specs" JSONB;
