/*
  Warnings:

  - The values [PRODUCT_CATEGORY,BLOG_POST,BLOG_POST_CATEGORY] on the enum `ResourceType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `ProductCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('ARTICLE', 'PRODUCT', 'INDUSTRY');

-- CreateEnum
CREATE TYPE "PartnerType" AS ENUM ('MANUFACTURER', 'SUPPLIER');

-- CreateEnum
CREATE TYPE "PermissionType" AS ENUM ('GLOBAL', 'PARTNER', 'CUSTOMER');

-- AlterEnum
BEGIN;
CREATE TYPE "ResourceType_new" AS ENUM ('USER', 'ROLE', 'PERMISSION', 'CATEGORY', 'ARTICLE');
ALTER TABLE "Permission" ALTER COLUMN "resource" TYPE "ResourceType_new" USING ("resource"::text::"ResourceType_new");
ALTER TYPE "ResourceType" RENAME TO "ResourceType_old";
ALTER TYPE "ResourceType_new" RENAME TO "ResourceType";
DROP TYPE "ResourceType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_meta_field_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_parent_category_id_fkey";

-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "permission_type" "PermissionType" NOT NULL DEFAULT 'GLOBAL';

-- DropTable
DROP TABLE "ProductCategory";

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone_number" TEXT,
    "address" TEXT,
    "partner_type" "PartnerType" NOT NULL,
    "website" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "parent_category_id" TEXT,
    "meta_field_id" TEXT,
    "name" TEXT NOT NULL,
    "mdx_content" TEXT NOT NULL,
    "category_type" "CategoryType" NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "constraints" JSONB,

    CONSTRAINT "Facet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacetValue" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "FacetValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Partner_partner_type_idx" ON "Partner"("partner_type");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Category_meta_field_id_idx" ON "Category"("meta_field_id");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_meta_field_id_fkey" FOREIGN KEY ("meta_field_id") REFERENCES "MetaField"("id") ON DELETE SET NULL ON UPDATE CASCADE;
