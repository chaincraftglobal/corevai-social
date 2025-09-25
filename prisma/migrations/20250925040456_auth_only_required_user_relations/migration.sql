/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `BrandInfo` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Post" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BrandInfo_userId_key" ON "public"."BrandInfo"("userId");

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "public"."Post"("userId");

-- CreateIndex
CREATE INDEX "Post_status_idx" ON "public"."Post"("status");

-- CreateIndex
CREATE INDEX "Post_dateISO_idx" ON "public"."Post"("dateISO");

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
