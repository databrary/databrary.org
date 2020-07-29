
COMMENT ON COLUMN "public"."users"."display_full_name" IS E'null'
alter table "public"."users" rename column "displayFullName" to "display_full_name";