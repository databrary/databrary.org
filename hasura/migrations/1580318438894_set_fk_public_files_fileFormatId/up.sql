

           alter table "public"."files"
           add constraint "files_fileFormatId_fkey"
           foreign key ("fileFormatId")
           references "public"."fileformats"
           ("id") on update no action on delete no action;
      