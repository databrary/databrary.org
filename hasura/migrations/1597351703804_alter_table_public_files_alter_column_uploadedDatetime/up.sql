ALTER TABLE ONLY "public"."files" ALTER COLUMN "uploadedDatetime" SET DEFAULT utcnow();
ALTER TABLE "public"."files" ALTER COLUMN "uploadedDatetime" SET NOT NULL;
