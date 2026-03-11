-- AlterEnum
ALTER TYPE "SectionType" ADD VALUE 'CUSTOM';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "customSection" JSONB;
