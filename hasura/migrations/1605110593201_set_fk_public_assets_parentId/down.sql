alter table "public"."assets" drop constraint "assets_parentId_fkey",
          add constraint "assets_parentId_fkey"
          foreign key ("parentId")
          references "public"."assets"
          ("id")
          on update no action
          on delete no action;
