ALTER TABLE "public"."projects_funding" ALTER COLUMN "awards" TYPE text;
ALTER TABLE "public"."projects_funding" ALTER COLUMN "awards" DROP DEFAULT;
ALTER TABLE "public"."projects_funding" ALTER COLUMN "awards" DROP NOT NULL;
