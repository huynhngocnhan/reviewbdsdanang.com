/*
  Warnings:

  - You are about to drop the column `customSections` on the `Project` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('NEW', 'CONTACTED', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "customSections";

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phonenum" TEXT NOT NULL,
    "project" TEXT,
    "note" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'NEW',
    "handledByAdminId" TEXT,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_status_idx" ON "Report"("status");

-- CreateIndex
CREATE INDEX "Report_handledByAdminId_idx" ON "Report"("handledByAdminId");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_handledByAdminId_fkey" FOREIGN KEY ("handledByAdminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
