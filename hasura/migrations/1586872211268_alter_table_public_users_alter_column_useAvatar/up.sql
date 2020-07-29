
ALTER TABLE "public"."users" ALTER COLUMN "useAvatar" TYPE bool;
alter table "public"."users" rename column "useAvatar" to "useGravatar";