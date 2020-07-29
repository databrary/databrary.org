

           alter table "public"."users"
           add constraint "users_fileObjectId_fkey"
           foreign key ("fileObjectId")
           references "public"."fileobjects"
           ("id") on update no action on delete cascade;
      