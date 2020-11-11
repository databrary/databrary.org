alter table "public"."files" drop constraint "files_asset_id_fkey",
             add constraint "files_assetId_fkey"
             foreign key ("assetId")
             references "public"."assets"
             ("id") on update no action on delete cascade;
