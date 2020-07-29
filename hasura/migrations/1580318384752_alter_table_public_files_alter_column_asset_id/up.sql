
ALTER TABLE "public"."files" ALTER COLUMN "asset_id" TYPE int4;
alter table "public"."files" rename column "asset_id" to "assetId";