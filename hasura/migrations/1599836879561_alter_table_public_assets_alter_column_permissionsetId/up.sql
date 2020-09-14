ALTER TABLE ONLY "public"."assets" ALTER COLUMN "permissionsetId" SET DEFAULT create_permissionsets();
ALTER TABLE "public"."assets" ALTER COLUMN "permissionsetId" SET NOT NULL;
