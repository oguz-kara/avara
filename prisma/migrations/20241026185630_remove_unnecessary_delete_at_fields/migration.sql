/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `BlogPost` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `BlogPostCategory` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `MetaField` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BlogPost" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "BlogPostCategory" DROP COLUMN "deleted_at";

-- AlterTable
ALTER TABLE "MetaField" DROP COLUMN "deleted_at";
