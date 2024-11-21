/*
  Warnings:

  - You are about to drop the column `constraints` on the `Facet` table. All the data in the column will be lost.
  - You are about to drop the column `data_type` on the `Facet` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `FacetValue` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `Facet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `FacetValue` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facet_id,name]` on the table `FacetValue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Facet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `FacetValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `FacetValue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "CategoryType" ADD VALUE 'APPLICATION';

-- DropForeignKey
ALTER TABLE "_ChannelFacets" DROP CONSTRAINT "_ChannelFacets_B_fkey";

-- DropIndex
DROP INDEX "FacetValue_facet_id_value_key";

-- AlterTable
ALTER TABLE "Facet" DROP COLUMN "constraints",
DROP COLUMN "data_type",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "is_private" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "FacetValue" DROP COLUMN "value",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "featured_image_id" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT,
    "created_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "tax_rate_id" TEXT,
    "featured_asset_id" TEXT,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "sku" TEXT,
    "price_includes_tax" BOOLEAN NOT NULL DEFAULT false,
    "currency_code" TEXT NOT NULL,
    "stock_threshold" INTEGER NOT NULL DEFAULT 0,
    "track_inventory" BOOLEAN NOT NULL DEFAULT true,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT,
    "created_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxRate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockLevel" (
    "id" TEXT NOT NULL,
    "variant_id" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StockLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "values" TEXT[],

    CONSTRAINT "ProductOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "currency_code" TEXT NOT NULL DEFAULT 'USD',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "updated_by" TEXT,
    "created_by" TEXT,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" TEXT,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductDocuments" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductImages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_VariantImages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_VariantCollections" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_VariantOptions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProductFacetValues" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_VariantFacets" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelFacetValues" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelProducts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelVariants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelPrices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_name_key" ON "Product"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductDocuments_AB_unique" ON "_ProductDocuments"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductDocuments_B_index" ON "_ProductDocuments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductImages_AB_unique" ON "_ProductImages"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductImages_B_index" ON "_ProductImages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_VariantImages_AB_unique" ON "_VariantImages"("A", "B");

-- CreateIndex
CREATE INDEX "_VariantImages_B_index" ON "_VariantImages"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_VariantCollections_AB_unique" ON "_VariantCollections"("A", "B");

-- CreateIndex
CREATE INDEX "_VariantCollections_B_index" ON "_VariantCollections"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_VariantOptions_AB_unique" ON "_VariantOptions"("A", "B");

-- CreateIndex
CREATE INDEX "_VariantOptions_B_index" ON "_VariantOptions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductFacetValues_AB_unique" ON "_ProductFacetValues"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductFacetValues_B_index" ON "_ProductFacetValues"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_VariantFacets_AB_unique" ON "_VariantFacets"("A", "B");

-- CreateIndex
CREATE INDEX "_VariantFacets_B_index" ON "_VariantFacets"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelFacetValues_AB_unique" ON "_ChannelFacetValues"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelFacetValues_B_index" ON "_ChannelFacetValues"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelProducts_AB_unique" ON "_ChannelProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelProducts_B_index" ON "_ChannelProducts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelVariants_AB_unique" ON "_ChannelVariants"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelVariants_B_index" ON "_ChannelVariants"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelPrices_AB_unique" ON "_ChannelPrices"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelPrices_B_index" ON "_ChannelPrices"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Facet_code_key" ON "Facet"("code");

-- CreateIndex
CREATE UNIQUE INDEX "FacetValue_code_key" ON "FacetValue"("code");

-- CreateIndex
CREATE UNIQUE INDEX "FacetValue_facet_id_name_key" ON "FacetValue"("facet_id", "name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_featured_image_id_fkey" FOREIGN KEY ("featured_image_id") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_tax_rate_id_fkey" FOREIGN KEY ("tax_rate_id") REFERENCES "TaxRate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_featured_asset_id_fkey" FOREIGN KEY ("featured_asset_id") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLevel" ADD CONSTRAINT "StockLevel_variant_id_fkey" FOREIGN KEY ("variant_id") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductDocuments" ADD CONSTRAINT "_ProductDocuments_A_fkey" FOREIGN KEY ("A") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductDocuments" ADD CONSTRAINT "_ProductDocuments_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductImages" ADD CONSTRAINT "_ProductImages_A_fkey" FOREIGN KEY ("A") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductImages" ADD CONSTRAINT "_ProductImages_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantImages" ADD CONSTRAINT "_VariantImages_A_fkey" FOREIGN KEY ("A") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantImages" ADD CONSTRAINT "_VariantImages_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantCollections" ADD CONSTRAINT "_VariantCollections_A_fkey" FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantCollections" ADD CONSTRAINT "_VariantCollections_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantOptions" ADD CONSTRAINT "_VariantOptions_A_fkey" FOREIGN KEY ("A") REFERENCES "ProductOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantOptions" ADD CONSTRAINT "_VariantOptions_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductFacetValues" ADD CONSTRAINT "_ProductFacetValues_A_fkey" FOREIGN KEY ("A") REFERENCES "FacetValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductFacetValues" ADD CONSTRAINT "_ProductFacetValues_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantFacets" ADD CONSTRAINT "_VariantFacets_A_fkey" FOREIGN KEY ("A") REFERENCES "FacetValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_VariantFacets" ADD CONSTRAINT "_VariantFacets_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelFacets" ADD CONSTRAINT "_ChannelFacets_B_fkey" FOREIGN KEY ("B") REFERENCES "Facet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelFacetValues" ADD CONSTRAINT "_ChannelFacetValues_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelFacetValues" ADD CONSTRAINT "_ChannelFacetValues_B_fkey" FOREIGN KEY ("B") REFERENCES "FacetValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelProducts" ADD CONSTRAINT "_ChannelProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelProducts" ADD CONSTRAINT "_ChannelProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelVariants" ADD CONSTRAINT "_ChannelVariants_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelVariants" ADD CONSTRAINT "_ChannelVariants_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelPrices" ADD CONSTRAINT "_ChannelPrices_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelPrices" ADD CONSTRAINT "_ChannelPrices_B_fkey" FOREIGN KEY ("B") REFERENCES "Price"("id") ON DELETE CASCADE ON UPDATE CASCADE;
