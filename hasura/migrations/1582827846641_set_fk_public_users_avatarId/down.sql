

          alter table "public"."users" drop constraint "users_avatarId_fkey",
          add constraint "users_fileObjectId_fkey"
          foreign key ("avatarId")
          references "public"."fileobjects"
          ("id")
          on update no action
          on delete cascade;
        