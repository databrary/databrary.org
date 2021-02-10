ALTER TABLE "public"."projects" ADD COLUMN "links" jsonb NOT NULL DEFAULT jsonb_build_array();
