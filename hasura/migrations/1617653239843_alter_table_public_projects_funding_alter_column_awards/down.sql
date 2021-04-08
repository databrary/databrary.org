ALTER TABLE "public"."projects_funding" ALTER COLUMN "awards" TYPE jsonb;
ALTER TABLE ONLY "public"."projects_funding" ALTER COLUMN "awards" SET DEFAULT jsonb_build_array();
ALTER TABLE "public"."projects_funding" ALTER COLUMN "awards" SET NOT NULL;
