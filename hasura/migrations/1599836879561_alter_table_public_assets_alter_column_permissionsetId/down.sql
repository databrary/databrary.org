ALTER TABLE ONLY "public"."assets" ALTER COLUMN "permissionsetId" DROP DEFAULT;
ALTER TABLE "public"."assets" ALTER COLUMN "permissionsetId" DROP NOT NULL;
