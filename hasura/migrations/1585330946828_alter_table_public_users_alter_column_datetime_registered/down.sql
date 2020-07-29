
ALTER TABLE "public"."users" ALTER COLUMN "datetime_registered" TYPE timestamp with time zone;
COMMENT ON COLUMN "public"."users"."datetime_registered" IS E'null'
alter table "public"."users" rename column "datetimeRegistered" to "datetime_registered";