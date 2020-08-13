ALTER TABLE ONLY "public"."files" ALTER COLUMN "uploadedDatetime" DROP DEFAULT;
ALTER TABLE "public"."files" ALTER COLUMN "uploadedDatetime" DROP NOT NULL;
