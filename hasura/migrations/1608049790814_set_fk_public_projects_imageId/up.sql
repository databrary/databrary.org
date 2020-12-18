alter table "public"."projects"
           add constraint "projects_imageId_fkey"
           foreign key ("imageId")
           references "public"."assets"
           ("id") on update no action on delete set null;
