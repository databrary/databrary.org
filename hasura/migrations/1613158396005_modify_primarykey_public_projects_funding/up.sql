alter table "public"."projects_funding" drop constraint "projects_funding_pkey";
alter table "public"."projects_funding"
    add constraint "projects_funding_pkey" 
    primary key ( "id" );
