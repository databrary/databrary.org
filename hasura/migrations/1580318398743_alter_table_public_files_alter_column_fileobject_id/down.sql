
ALTER TABLE "public"."files" ALTER COLUMN "fileobject_id" TYPE integer;
COMMENT ON COLUMN "public"."files"."fileobject_id" IS E'null'
alter table "public"."files" rename column "fileobjectId" to "fileobject_id";