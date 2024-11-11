/*
  Warnings:

  - You are about to drop the column `mdx_content` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `meta_field_id` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `mdx_content` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `meta_field_id` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `meta_description` on the `MetaField` table. All the data in the column will be lost.
  - You are about to drop the column `meta_robots` on the `MetaField` table. All the data in the column will be lost.
  - You are about to drop the column `meta_title` on the `MetaField` table. All the data in the column will be lost.
  - You are about to drop the column `twitter_description` on the `MetaField` table. All the data in the column will be lost.
  - You are about to drop the column `twitter_image` on the `MetaField` table. All the data in the column will be lost.
  - You are about to drop the column `twitter_title` on the `MetaField` table. All the data in the column will be lost.
  - Added the required column `content` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_type` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content_type` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `MetaField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `MetaField` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('MD', 'MDX', 'HTML');

-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_meta_field_id_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_meta_field_id_fkey";

-- DropIndex
DROP INDEX "Article_meta_field_id_idx";

-- DropIndex
DROP INDEX "Category_meta_field_id_idx";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "mdx_content",
DROP COLUMN "meta_field_id",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "content_type" "ContentType" NOT NULL,
ADD COLUMN     "seo_metadata_id" TEXT;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "mdx_content",
DROP COLUMN "meta_field_id",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "content_type" "ContentType" NOT NULL,
ADD COLUMN     "seo_metadata_id" TEXT;

-- AlterTable
ALTER TABLE "MetaField" DROP COLUMN "meta_description",
DROP COLUMN "meta_robots",
DROP COLUMN "meta_title",
DROP COLUMN "twitter_description",
DROP COLUMN "twitter_image",
DROP COLUMN "twitter_title",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "robots" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Article_seo_metadata_id_idx" ON "Article"("seo_metadata_id");

-- CreateIndex
CREATE INDEX "Category_seo_metadata_id_idx" ON "Category"("seo_metadata_id");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_seo_metadata_id_fkey" FOREIGN KEY ("seo_metadata_id") REFERENCES "MetaField"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_seo_metadata_id_fkey" FOREIGN KEY ("seo_metadata_id") REFERENCES "MetaField"("id") ON DELETE SET NULL ON UPDATE CASCADE;
