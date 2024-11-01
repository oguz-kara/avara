/*
  Warnings:

  - The values [DEACTIVE] on the enum `UserActiveStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserActiveStatus_new" AS ENUM ('INACTIVE', 'ACTIVE', 'BANNED', 'FRAUD');
ALTER TABLE "User" ALTER COLUMN "is_active" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "is_active" TYPE "UserActiveStatus_new" USING ("is_active"::text::"UserActiveStatus_new");
ALTER TYPE "UserActiveStatus" RENAME TO "UserActiveStatus_old";
ALTER TYPE "UserActiveStatus_new" RENAME TO "UserActiveStatus";
DROP TYPE "UserActiveStatus_old";
ALTER TABLE "User" ALTER COLUMN "is_active" SET DEFAULT 'INACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "is_active" SET DEFAULT 'INACTIVE';
