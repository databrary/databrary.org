
ALTER TABLE "public"."files" ALTER COLUMN "uploaded_by_id" TYPE integer;
COMMENT ON COLUMN "public"."files"."uploaded_by_id" IS E'null'
alter table "public"."files" rename column "uploadedById" to "uploaded_by_id";