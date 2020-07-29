
ALTER TABLE "public"."users" ALTER COLUMN "datetime_registered" TYPE timestamptz;
alter table "public"."users" rename column "datetime_registered" to "datetimeRegistered";