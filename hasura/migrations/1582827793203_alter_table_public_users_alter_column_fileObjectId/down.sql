
ALTER TABLE "public"."users" ALTER COLUMN "fileObjectId" TYPE integer;
COMMENT ON COLUMN "public"."users"."fileObjectId" IS E'null'
alter table "public"."users" rename column "avatarId" to "fileObjectId";