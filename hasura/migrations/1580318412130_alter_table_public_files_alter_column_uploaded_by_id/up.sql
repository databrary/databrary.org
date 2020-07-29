
ALTER TABLE "public"."files" ALTER COLUMN "uploaded_by_id" TYPE int4;
alter table "public"."files" rename column "uploaded_by_id" to "uploadedById";