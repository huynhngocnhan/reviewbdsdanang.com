/*
  Warnings:

  - The values [AMENITIES] on the enum `SectionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SectionType_new" AS ENUM ('OVERVIEW', 'LOCATION', 'GALLERY', 'EXTENTION', 'FLOORPLAN', 'PRICE', 'PROGRESS', 'FAQ', 'CTA');
ALTER TABLE "ProjectSection" ALTER COLUMN "type" TYPE "SectionType_new" USING ("type"::text::"SectionType_new");
ALTER TYPE "SectionType" RENAME TO "SectionType_old";
ALTER TYPE "SectionType_new" RENAME TO "SectionType";
DROP TYPE "public"."SectionType_old";
COMMIT;
