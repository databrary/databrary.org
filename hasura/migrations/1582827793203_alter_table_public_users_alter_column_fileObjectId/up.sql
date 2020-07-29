
ALTER TABLE "public"."users" ALTER COLUMN "fileObjectId" TYPE int4;
alter table "public"."users" rename column "fileObjectId" to "avatarId";