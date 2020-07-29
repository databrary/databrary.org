
COMMENT ON COLUMN "public"."users"."email_primary" IS E'null'
alter table "public"."users" rename column "emailPrimary" to "email_primary";