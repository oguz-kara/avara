-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('USER', 'ROLE', 'PERMISSION', 'PRODUCT_CATEGORY', 'BLOG_POST', 'BLOG_POST_CATEGORY');

-- CreateEnum
CREATE TYPE "ActionType" AS ENUM ('READ', 'WRITE', 'DELETE', 'UPDATE', 'ALL');

-- CreateEnum
CREATE TYPE "ScopeType" AS ENUM ('SELF', 'GLOBAL');

-- CreateEnum
CREATE TYPE "UserActiveStatus" AS ENUM ('DEACTIVE', 'ACTIVE', 'BANNED', 'FRAUD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "oauth_provider_id" TEXT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "email_verification_token" TEXT,
    "reset_password_token" TEXT,
    "oauth_provider" TEXT,
    "two_factor_secret" TEXT,
    "permissions" TEXT[],
    "two_factor_enabled" BOOLEAN NOT NULL DEFAULT false,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" "UserActiveStatus" NOT NULL DEFAULT 'DEACTIVE',
    "reset_password_expires" TIMESTAMP(3),
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "specific_scope_id" TEXT,
    "resource" "ResourceType" NOT NULL,
    "action" "ActionType" NOT NULL,
    "scope" "ScopeType" NOT NULL,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "parent_category_id" TEXT,
    "meta_field_id" TEXT,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "meta_field_id" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetaField" (
    "id" TEXT NOT NULL,
    "meta_title" TEXT NOT NULL,
    "meta_description" TEXT NOT NULL,
    "keywords" TEXT[],
    "version" INTEGER NOT NULL DEFAULT 1,
    "canonical_url" TEXT,
    "og_title" TEXT,
    "og_description" TEXT,
    "og_image" TEXT,
    "twitter_title" TEXT,
    "twitter_description" TEXT,
    "twitter_image" TEXT,
    "meta_robots" TEXT,
    "schema_markup" TEXT,
    "hreflang" TEXT[],
    "page_type" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "MetaField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPostCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "BlogPostCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lang" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "direction" TEXT NOT NULL DEFAULT 'ltr',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Lang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" TEXT NOT NULL,
    "site_on" BOOLEAN NOT NULL DEFAULT false,
    "default_language" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "site_name" TEXT NOT NULL DEFAULT 'yag_ve_yag',
    "contact_email" TEXT,
    "allow_registration" BOOLEAN NOT NULL DEFAULT true,
    "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
    "default_meta_title" TEXT,
    "default_meta_description" TEXT,
    "default_meta_keywords" TEXT[],
    "smtp_host" TEXT,
    "smtp_port" INTEGER,
    "smtp_username" TEXT,
    "smtp_password" TEXT,
    "max_file_upload_size" INTEGER NOT NULL DEFAULT 10485760,
    "allowed_file_types" TEXT[] DEFAULT ARRAY['jpg', 'png', 'pdf']::TEXT[],
    "max_login_attempts" INTEGER NOT NULL DEFAULT 5,
    "password_min_length" INTEGER NOT NULL DEFAULT 8,
    "google_analytics_key" TEXT,
    "stripe_api_key" TEXT,
    "facebook_url" TEXT,
    "twitter_url" TEXT,
    "linkedin_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_id_idx" ON "User"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_name_key" ON "ProductCategory"("name");

-- CreateIndex
CREATE INDEX "ProductCategory_meta_field_id_idx" ON "ProductCategory"("meta_field_id");

-- CreateIndex
CREATE INDEX "BlogPost_meta_field_id_idx" ON "BlogPost"("meta_field_id");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPostCategory_name_key" ON "BlogPostCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Lang_name_key" ON "Lang"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Lang_code_key" ON "Lang"("code");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "ProductCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_meta_field_id_fkey" FOREIGN KEY ("meta_field_id") REFERENCES "MetaField"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_meta_field_id_fkey" FOREIGN KEY ("meta_field_id") REFERENCES "MetaField"("id") ON DELETE SET NULL ON UPDATE CASCADE;
