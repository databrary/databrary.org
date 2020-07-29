

             alter table "public"."users" drop constraint "users_fileObjectId_fkey",
             add constraint "users_avatarId_fkey"
             foreign key ("avatarId")
             references "public"."assets"
             ("id") on update no action on delete cascade;
      