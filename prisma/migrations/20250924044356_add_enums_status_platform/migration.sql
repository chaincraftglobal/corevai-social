/*
  Warnings:

  - The `platforms` column on the `BrandInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `status` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `platform` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "public"."Platform" AS ENUM ('LinkedIn', 'Twitter', 'Instagram', 'Facebook');

-- AlterTable
ALTER TABLE "public"."BrandInfo" DROP COLUMN "platforms",
ADD COLUMN     "platforms" "public"."Platform"[];

-- AlterTable
ALTER TABLE "public"."Post" DROP COLUMN "status",
ADD COLUMN     "status" "public"."Status" NOT NULL,
DROP COLUMN "platform",
ADD COLUMN     "platform" "public"."Platform" NOT NULL;
