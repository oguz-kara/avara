/*
  Warnings:

  - You are about to drop the column `created_at` on the `Administrator` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `Administrator` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Administrator` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `Administrator` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Administrator` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `Administrator` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Administrator` table. All the data in the column will be lost.
  - You are about to drop the column `content_type` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `seo_metadata_id` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `file_size` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `focal_point` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `mime_type` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `original_name` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `storage_provider` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `Asset` table. All the data in the column will be lost.
  - You are about to drop the column `category_type` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `content_type` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `parent_category_id` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `seo_metadata_id` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `currency_code` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `default_language_code` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `is_default` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `Channel` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Facet` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `Facet` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Facet` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `Facet` table. All the data in the column will be lost.
  - You are about to drop the column `is_private` on the `Facet` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Facet` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `Facet` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `FacetValue` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `FacetValue` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `FacetValue` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `FacetValue` table. All the data in the column will be lost.
  - You are about to drop the column `facet_id` on the `FacetValue` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `FacetValue` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `FacetValue` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Lang` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Lang` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Lang` table. All the data in the column will be lost.
  - You are about to drop the column `canonical_url` on the `MetaField` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `MetaField` table. All the data in the column will be lost.
  - You are about to drop the column `og_description` on the `MetaField` table. All the data in the column will be lost.
  - You are about to drop the column `og_image` on the `MetaField` table. All the data in the column will be lost.
  - You are about to drop the column `og_title` on the `MetaField` table. All the data in the column will be lost.
  - You are about to drop the column `page_type` on the `MetaField` table. All the data in the column will be lost.
  - You are about to drop the column `schema_markup` on the `MetaField` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `MetaField` table. All the data in the column will be lost.
  - You are about to drop the column `channel_id` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `partner_type` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `Partner` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `permission_type` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `specific_scope_id` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `currency_code` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `Price` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `featured_image_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `ProductCollection` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `ProductCollection` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `ProductCollection` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `ProductCollection` table. All the data in the column will be lost.
  - You are about to drop the column `is_dynamic` on the `ProductCollection` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `ProductCollection` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `ProductCollection` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `currency_code` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `featured_asset_id` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `is_enabled` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `price_includes_tax` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `stock_threshold` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `tax_rate_id` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `track_inventory` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `ProductVariant` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `permission_id` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `RolePermission` table. All the data in the column will be lost.
  - You are about to drop the column `variant_id` on the `StockLevel` table. All the data in the column will be lost.
  - You are about to drop the column `allow_registration` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `allowed_file_types` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `contact_email` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `default_language` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `default_meta_description` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `default_meta_keywords` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `default_meta_title` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `facebook_url` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `google_analytics_key` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `linkedin_url` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `maintenance_mode` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `max_file_upload_size` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `max_login_attempts` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `password_min_length` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `site_name` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `site_on` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `smtp_host` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `smtp_password` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `smtp_port` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `smtp_username` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_api_key` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `twitter_url` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `SystemSettings` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email_verification_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email_verified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_login` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `oauth_provider` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `oauth_provider_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password_hash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `reset_password_expires` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `reset_password_token` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `two_factor_enabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `two_factor_secret` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `_ProductDocuments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductImages` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Administrator` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,categoryType]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facetId,name]` on the table `FacetValue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facetId,code]` on the table `FacetValue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[roleId,permissionId]` on the table `RolePermission` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Administrator` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentType` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileSize` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalName` to the `Asset` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryType` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contentType` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currencyCode` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `defaultLanguageCode` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facetId` to the `FacetValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `partnerType` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProductCollection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currencyCode` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permissionId` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `RolePermission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `StockLevel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Administrator" DROP CONSTRAINT "Administrator_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_seo_metadata_id_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parent_category_id_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_seo_metadata_id_fkey";

-- DropForeignKey
ALTER TABLE "FacetValue" DROP CONSTRAINT "FacetValue_facet_id_fkey";

-- DropForeignKey
ALTER TABLE "Partner" DROP CONSTRAINT "Partner_channel_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_featured_image_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_featured_asset_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_product_id_fkey";

-- DropForeignKey
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_tax_rate_id_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_permission_id_fkey";

-- DropForeignKey
ALTER TABLE "RolePermission" DROP CONSTRAINT "RolePermission_role_id_fkey";

-- DropForeignKey
ALTER TABLE "StockLevel" DROP CONSTRAINT "StockLevel_variant_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_role_id_fkey";

-- DropForeignKey
ALTER TABLE "_ProductDocuments" DROP CONSTRAINT "_ProductDocuments_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductDocuments" DROP CONSTRAINT "_ProductDocuments_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProductImages" DROP CONSTRAINT "_ProductImages_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductImages" DROP CONSTRAINT "_ProductImages_B_fkey";

-- DropIndex
DROP INDEX "Administrator_user_id_key";

-- DropIndex
DROP INDEX "Article_seo_metadata_id_idx";

-- DropIndex
DROP INDEX "Category_name_category_type_key";

-- DropIndex
DROP INDEX "Category_seo_metadata_id_idx";

-- DropIndex
DROP INDEX "FacetValue_facet_id_code_key";

-- DropIndex
DROP INDEX "FacetValue_facet_id_name_key";

-- DropIndex
DROP INDEX "Partner_partner_type_idx";

-- DropIndex
DROP INDEX "RolePermission_role_id_permission_id_key";

-- DropIndex
DROP INDEX "User_role_id_idx";

-- AlterTable
ALTER TABLE "Administrator" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "content_type",
DROP COLUMN "created_at",
DROP COLUMN "seo_metadata_id",
DROP COLUMN "updated_at",
ADD COLUMN     "contentType" "ContentType" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "seoMetadataId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Asset" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "file_size",
DROP COLUMN "focal_point",
DROP COLUMN "mime_type",
DROP COLUMN "original_name",
DROP COLUMN "storage_provider",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "fileSize" INTEGER NOT NULL,
ADD COLUMN     "focalPoint" JSONB,
ADD COLUMN     "mimeType" TEXT NOT NULL,
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "storageProvider" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "category_type",
DROP COLUMN "content_type",
DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "parent_category_id",
DROP COLUMN "seo_metadata_id",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "categoryType" "CategoryType" NOT NULL,
ADD COLUMN     "contentType" "ContentType" NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "parentCategoryId" TEXT,
ADD COLUMN     "seoMetadataId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "currency_code",
DROP COLUMN "default_language_code",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "is_default",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "currencyCode" TEXT NOT NULL,
ADD COLUMN     "defaultLanguageCode" TEXT NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Facet" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "is_private",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "FacetValue" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "facet_id",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "facetId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Lang" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "MetaField" DROP COLUMN "canonical_url",
DROP COLUMN "created_at",
DROP COLUMN "og_description",
DROP COLUMN "og_image",
DROP COLUMN "og_title",
DROP COLUMN "page_type",
DROP COLUMN "schema_markup",
DROP COLUMN "updated_at",
ADD COLUMN     "canonicalUrl" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ogDescription" TEXT,
ADD COLUMN     "ogImage" TEXT,
ADD COLUMN     "ogTitle" TEXT,
ADD COLUMN     "pageType" TEXT,
ADD COLUMN     "schemaMarkup" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Partner" DROP COLUMN "channel_id",
DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "partner_type",
DROP COLUMN "phone_number",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "channelId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "partnerType" "PartnerType" NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "permission_type",
DROP COLUMN "specific_scope_id",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "permissionType" "PermissionType" NOT NULL DEFAULT 'GLOBAL',
ADD COLUMN     "specificScopeId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Price" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "currency_code",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "end_date",
DROP COLUMN "is_active",
DROP COLUMN "product_id",
DROP COLUMN "start_date",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "currencyCode" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "featured_image_id",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "featuredAssetId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "ProductCollection" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "is_dynamic",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "isDynamic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "currency_code",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "featured_asset_id",
DROP COLUMN "is_enabled",
DROP COLUMN "price_includes_tax",
DROP COLUMN "product_id",
DROP COLUMN "stock_threshold",
DROP COLUMN "tax_rate_id",
DROP COLUMN "track_inventory",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "currencyCode" TEXT NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "featuredAssetId" TEXT,
ADD COLUMN     "isEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "priceIncludesTax" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "stockThreshold" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "taxRateId" TEXT,
ADD COLUMN     "trackInventory" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "RolePermission" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "is_active",
DROP COLUMN "permission_id",
DROP COLUMN "role_id",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "permissionId" TEXT NOT NULL,
ADD COLUMN     "roleId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;

-- AlterTable
ALTER TABLE "StockLevel" DROP COLUMN "variant_id",
ADD COLUMN     "variantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SystemSettings" DROP COLUMN "allow_registration",
DROP COLUMN "allowed_file_types",
DROP COLUMN "contact_email",
DROP COLUMN "created_at",
DROP COLUMN "default_language",
DROP COLUMN "default_meta_description",
DROP COLUMN "default_meta_keywords",
DROP COLUMN "default_meta_title",
DROP COLUMN "facebook_url",
DROP COLUMN "google_analytics_key",
DROP COLUMN "linkedin_url",
DROP COLUMN "maintenance_mode",
DROP COLUMN "max_file_upload_size",
DROP COLUMN "max_login_attempts",
DROP COLUMN "password_min_length",
DROP COLUMN "site_name",
DROP COLUMN "site_on",
DROP COLUMN "smtp_host",
DROP COLUMN "smtp_password",
DROP COLUMN "smtp_port",
DROP COLUMN "smtp_username",
DROP COLUMN "stripe_api_key",
DROP COLUMN "twitter_url",
DROP COLUMN "updated_at",
ADD COLUMN     "allowRegistration" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "allowedFileTypes" TEXT[] DEFAULT ARRAY['jpg', 'png', 'pdf']::TEXT[],
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "defaultLanguage" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "defaultMetaDescription" TEXT,
ADD COLUMN     "defaultMetaKeywords" TEXT[],
ADD COLUMN     "defaultMetaTitle" TEXT,
ADD COLUMN     "facebookUrl" TEXT,
ADD COLUMN     "googleAnalyticsKey" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxFileUploadSize" INTEGER NOT NULL DEFAULT 10485760,
ADD COLUMN     "maxLoginAttempts" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "passwordMinLength" INTEGER NOT NULL DEFAULT 8,
ADD COLUMN     "siteName" TEXT NOT NULL DEFAULT 'yagVeYag',
ADD COLUMN     "siteOn" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "smtpHost" TEXT,
ADD COLUMN     "smtpPassword" TEXT,
ADD COLUMN     "smtpPort" INTEGER,
ADD COLUMN     "smtpUsername" TEXT,
ADD COLUMN     "stripeApiKey" TEXT,
ADD COLUMN     "twitterUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "created_at",
DROP COLUMN "created_by",
DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "email_verification_token",
DROP COLUMN "email_verified",
DROP COLUMN "is_active",
DROP COLUMN "last_login",
DROP COLUMN "oauth_provider",
DROP COLUMN "oauth_provider_id",
DROP COLUMN "password_hash",
DROP COLUMN "reset_password_expires",
DROP COLUMN "reset_password_token",
DROP COLUMN "role_id",
DROP COLUMN "two_factor_enabled",
DROP COLUMN "two_factor_secret",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "deletedBy" TEXT,
ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isActive" "UserActiveStatus" NOT NULL DEFAULT 'INACTIVE',
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "oauthProvider" TEXT,
ADD COLUMN     "oauthProviderId" TEXT,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT,
ADD COLUMN     "roleId" TEXT NOT NULL,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedBy" TEXT;

-- DropTable
DROP TABLE "_ProductDocuments";

-- DropTable
DROP TABLE "_ProductImages";

-- CreateTable
CREATE TABLE "_ProductAssets" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductAssets_AB_unique" ON "_ProductAssets"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductAssets_B_index" ON "_ProductAssets"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Administrator_userId_key" ON "Administrator"("userId");

-- CreateIndex
CREATE INDEX "Article_seoMetadataId_idx" ON "Article"("seoMetadataId");

-- CreateIndex
CREATE INDEX "Category_seoMetadataId_idx" ON "Category"("seoMetadataId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_categoryType_key" ON "Category"("name", "categoryType");

-- CreateIndex
CREATE UNIQUE INDEX "FacetValue_facetId_name_key" ON "FacetValue"("facetId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "FacetValue_facetId_code_key" ON "FacetValue"("facetId", "code");

-- CreateIndex
CREATE INDEX "Partner_partnerType_idx" ON "Partner"("partnerType");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "User_roleId_idx" ON "User"("roleId");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_featuredAssetId_fkey" FOREIGN KEY ("featuredAssetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_taxRateId_fkey" FOREIGN KEY ("taxRateId") REFERENCES "TaxRate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_featuredAssetId_fkey" FOREIGN KEY ("featuredAssetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLevel" ADD CONSTRAINT "StockLevel_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Administrator" ADD CONSTRAINT "Administrator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentCategoryId_fkey" FOREIGN KEY ("parentCategoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_seoMetadataId_fkey" FOREIGN KEY ("seoMetadataId") REFERENCES "MetaField"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_seoMetadataId_fkey" FOREIGN KEY ("seoMetadataId") REFERENCES "MetaField"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacetValue" ADD CONSTRAINT "FacetValue_facetId_fkey" FOREIGN KEY ("facetId") REFERENCES "Facet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductAssets" ADD CONSTRAINT "_ProductAssets_A_fkey" FOREIGN KEY ("A") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductAssets" ADD CONSTRAINT "_ProductAssets_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
