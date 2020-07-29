
alter table "public"."files" add foreign key ("fileFormatId") references "public"."fileformats"("id") on update no action on delete no action;