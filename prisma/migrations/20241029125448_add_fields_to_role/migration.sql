-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "updated_by" TEXT;
