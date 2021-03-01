ALTER TABLE "public"."projects" ADD COLUMN "collaborators" jsonb NOT NULL DEFAULT jsonb_build_array();
