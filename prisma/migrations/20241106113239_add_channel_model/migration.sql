/*
  Warnings:

  - You are about to drop the column `dataType` on the `Facet` table. All the data in the column will be lost.
  - You are about to drop the `ArticleCategory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[facet_id,value]` on the table `FacetValue` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `data_type` to the `Facet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `facet_id` to the `FacetValue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channel_id` to the `Partner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Facet" DROP COLUMN "dataType",
ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "data_type" TEXT NOT NULL,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "FacetValue" ADD COLUMN     "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "facet_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "channel_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "ArticleCategory";

-- CreateTable
CREATE TABLE "Channel" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "default_language_code" TEXT NOT NULL,
    "currency_code" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,
    "deleted_by" TEXT,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChannelCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelArticles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelRoles" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelPermissions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelRolePermission" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelMetaFields" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ChannelFacets" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_code_key" ON "Channel"("code");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelCategories_AB_unique" ON "_ChannelCategories"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelCategories_B_index" ON "_ChannelCategories"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelArticles_AB_unique" ON "_ChannelArticles"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelArticles_B_index" ON "_ChannelArticles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelRoles_AB_unique" ON "_ChannelRoles"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelRoles_B_index" ON "_ChannelRoles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelPermissions_AB_unique" ON "_ChannelPermissions"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelPermissions_B_index" ON "_ChannelPermissions"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelRolePermission_AB_unique" ON "_ChannelRolePermission"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelRolePermission_B_index" ON "_ChannelRolePermission"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelMetaFields_AB_unique" ON "_ChannelMetaFields"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelMetaFields_B_index" ON "_ChannelMetaFields"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ChannelFacets_AB_unique" ON "_ChannelFacets"("A", "B");

-- CreateIndex
CREATE INDEX "_ChannelFacets_B_index" ON "_ChannelFacets"("B");

-- CreateIndex
CREATE UNIQUE INDEX "FacetValue_facet_id_value_key" ON "FacetValue"("facet_id", "value");

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FacetValue" ADD CONSTRAINT "FacetValue_facet_id_fkey" FOREIGN KEY ("facet_id") REFERENCES "Facet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelCategories" ADD CONSTRAINT "_ChannelCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelCategories" ADD CONSTRAINT "_ChannelCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelArticles" ADD CONSTRAINT "_ChannelArticles_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelArticles" ADD CONSTRAINT "_ChannelArticles_B_fkey" FOREIGN KEY ("B") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelRoles" ADD CONSTRAINT "_ChannelRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelRoles" ADD CONSTRAINT "_ChannelRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelPermissions" ADD CONSTRAINT "_ChannelPermissions_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelPermissions" ADD CONSTRAINT "_ChannelPermissions_B_fkey" FOREIGN KEY ("B") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelRolePermission" ADD CONSTRAINT "_ChannelRolePermission_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelRolePermission" ADD CONSTRAINT "_ChannelRolePermission_B_fkey" FOREIGN KEY ("B") REFERENCES "RolePermission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelMetaFields" ADD CONSTRAINT "_ChannelMetaFields_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelMetaFields" ADD CONSTRAINT "_ChannelMetaFields_B_fkey" FOREIGN KEY ("B") REFERENCES "MetaField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelFacets" ADD CONSTRAINT "_ChannelFacets_A_fkey" FOREIGN KEY ("A") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChannelFacets" ADD CONSTRAINT "_ChannelFacets_B_fkey" FOREIGN KEY ("B") REFERENCES "FacetValue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
