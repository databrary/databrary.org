CREATE TABLE "public"."funder"("id" serial NOT NULL, "doi" text, "name" text NOT NULL, PRIMARY KEY ("id") , UNIQUE ("id"), UNIQUE ("doi"));
