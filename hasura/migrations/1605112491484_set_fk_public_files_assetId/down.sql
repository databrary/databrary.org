alter table "public"."files" drop constraint "files_assetId_fkey",
          add constraint "files_asset_id_fkey"
          foreign key ("assetId")
          references "public"."assets"
          ("id")
          on update no action
          on delete no action;
