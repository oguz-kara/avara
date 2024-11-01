/*
  Warnings:

  - A unique constraint covering the columns `[action,resource,scope]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "RolePermission" ADD COLUMN     "deleted_by" TIMESTAMP(3),
ADD COLUMN     "updated_by" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_by" TEXT,
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "updated_by" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Permission_action_resource_scope_key" ON "Permission"("action", "resource", "scope");
