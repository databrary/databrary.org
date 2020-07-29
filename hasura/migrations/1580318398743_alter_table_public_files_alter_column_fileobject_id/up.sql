
ALTER TABLE "public"."files" ALTER COLUMN "fileobject_id" TYPE int4;
alter table "public"."files" rename column "fileobject_id" to "fileobjectId";