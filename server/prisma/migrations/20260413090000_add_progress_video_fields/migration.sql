ALTER TABLE "Project"
ADD COLUMN IF NOT EXISTS "progressVideoUploadDate" TEXT;

ALTER TABLE "Project"
ADD COLUMN IF NOT EXISTS "progressVideoThumbnailUrl" TEXT;
