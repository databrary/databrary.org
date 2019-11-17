ALTER TABLE ONLY "public"."assets" ALTER COLUMN "permissionset_id" SET DEFAULT
      create_permissionsets();

CREATE TRIGGER create_inital_asset_permissions AFTER INSERT ON public.assets FOR EACH ROW EXECUTE PROCEDURE public.add_asset_group();
