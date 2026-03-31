/*
  Warnings:

  - You are about to drop the column `customSection` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project"
RENAME COLUMN "customSection" TO "customSections";

ALTER TABLE "Project"
ADD COLUMN "advertisingDisclaimer" TEXT,
ADD COLUMN "apartmentDesign" JSONB,
ADD COLUMN "extentionDestinations" JSONB,
ADD COLUMN "faqs" JSONB,
ADD COLUMN "floatingCtas" JSONB,
ADD COLUMN "floorplanByFloor" JSONB,
ADD COLUMN "floorplanMaster" JSONB,
ADD COLUMN "heroLeadForm" JSONB,
ADD COLUMN "homeOrder" INTEGER,
ADD COLUMN "legalInfo" JSONB,
ADD COLUMN "location360Url" TEXT,
ADD COLUMN "nearbyGroups" JSONB,
ADD COLUMN "nearbyTrafficItems" JSONB,
ADD COLUMN "progress" JSONB,
ADD COLUMN "progressDescription" TEXT,
ADD COLUMN "progressGallery" JSONB,
ADD COLUMN "progressMilestones" JSONB,
ADD COLUMN "progressVideoUrl" TEXT,
ADD COLUMN "progressYoutubeUrl" TEXT,
ADD COLUMN "reasonToBuy" JSONB,
ADD COLUMN "reasonToBuyDescription" TEXT,
ADD COLUMN "reasonToBuyImage" TEXT,
ADD COLUMN "reasonToBuyImageAlt" TEXT,
ADD COLUMN "reasonToBuyTitle" TEXT,
ADD COLUMN "salePolicy" JSONB,
ADD COLUMN "salePolicyAlt" TEXT,
ADD COLUMN "salePolicyDes" TEXT,
ADD COLUMN "salePolicyDescriptionDetails" JSONB,
ADD COLUMN "salePolicyImg" TEXT,
ADD COLUMN "salesPolicy" JSONB,
ADD COLUMN "seoHead" JSONB,
ADD COLUMN "showOnHome" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "stickyMenu" JSONB,
ADD COLUMN "unitLayouts" JSONB;
-- CreateIndex
CREATE INDEX "Project_showOnHome_homeOrder_idx" ON "Project"("showOnHome", "homeOrder");
