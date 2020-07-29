
ALTER TABLE "public"."users" ALTER COLUMN "useAvatar" TYPE boolean;
alter table "public"."users" rename column "useGravatar" to "useAvatar";