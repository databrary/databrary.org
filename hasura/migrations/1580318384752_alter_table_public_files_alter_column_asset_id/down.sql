
ALTER TABLE "public"."files" ALTER COLUMN "asset_id" TYPE integer;
COMMENT ON COLUMN "public"."files"."asset_id" IS E'null'
alter table "public"."files" rename column "assetId" to "asset_id";