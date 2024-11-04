/*
  Warnings:

  - The `schema_markup` column on the `MetaField` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `content` on the `ProductCategory` table. All the data in the column will be lost.
  - You are about to drop the `BlogPost` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BlogPostCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `mdx_content` to the `ProductCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "UserActiveStatus" ADD VALUE 'NOT_VERIFIED';

-- DropForeignKey
ALTER TABLE "BlogPost" DROP CONSTRAINT "BlogPost_meta_field_id_fkey";

-- AlterTable
ALTER TABLE "MetaField" DROP COLUMN "schema_markup",
ADD COLUMN     "schema_markup" JSONB;

-- AlterTable
ALTER TABLE "ProductCategory" DROP COLUMN "content",
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "mdx_content" TEXT NOT NULL,
ADD COLUMN     "updated_by" TEXT;

-- DropTable
DROP TABLE "BlogPost";

-- DropTable
DROP TABLE "BlogPostCategory";

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "meta_field_id" TEXT,
    "title" TEXT NOT NULL,
    "mdx_content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Article_meta_field_id_idx" ON "Article"("meta_field_id");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleCategory_name_key" ON "ArticleCategory"("name");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_meta_field_id_fkey" FOREIGN KEY ("meta_field_id") REFERENCES "MetaField"("id") ON DELETE SET NULL ON UPDATE CASCADE;
