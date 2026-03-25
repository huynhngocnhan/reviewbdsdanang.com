-- AlterTable
ALTER TABLE "Project"
ADD COLUMN "stickyMenu" JSONB,
ADD COLUMN "heroLeadForm" JSONB,
ADD COLUMN "reasonToBuy" JSONB,
ADD COLUMN "salesPolicy" JSONB,
ADD COLUMN "floorplanMaster" JSONB,
ADD COLUMN "floorplanByFloor" JSONB,
ADD COLUMN "unitLayouts" JSONB,
ADD COLUMN "progressMilestones" JSONB,
ADD COLUMN "progressGallery" JSONB,
ADD COLUMN "progressVideoUrl" TEXT,
ADD COLUMN "faqs" JSONB,
ADD COLUMN "legalInfo" JSONB,
ADD COLUMN "advertisingDisclaimer" TEXT,
ADD COLUMN "floatingCtas" JSONB,
ADD COLUMN "seoHead" JSONB;
