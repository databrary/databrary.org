alter table "public"."assets"
           add constraint "assets_parentId_fkey"
           foreign key ("parentId")
           references "public"."assets"
           ("id") on update no action on delete no action;
