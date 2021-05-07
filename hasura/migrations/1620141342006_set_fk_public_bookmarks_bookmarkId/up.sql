alter table "public"."bookmarks"
           add constraint "bookmarks_bookmarkId_fkey"
           foreign key ("bookmarkId")
           references "public"."assets"
           ("id") on update no action on delete cascade;
