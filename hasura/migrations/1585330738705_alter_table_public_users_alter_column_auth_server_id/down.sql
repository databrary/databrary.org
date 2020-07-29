
COMMENT ON COLUMN "public"."users"."auth_server_id" IS E'null'
alter table "public"."users" rename column "authServerId" to "auth_server_id";