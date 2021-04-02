CREATE OR REPLACE FUNCTION public.add_initial_asset_project()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
  BEGIN
  	IF TG_OP = 'INSERT' AND NEW."assetType" = 'pam' THEN
		INSERT INTO assets("assetType", "name", "createdById", "datetimeCreated", "permissionsetId", "privacyType", "parentId", "listAssets")
			VALUES ('project', 'Default Page View', NEW."createdById", DEFAULT, NEW."permissionsetId", NEW."privacyType", NEW."id", DEFAULT);
	END IF;
    RETURN NEW;
  END;
$function$;
CREATE TRIGGER create_initial_asset_project AFTER INSERT ON public.assets FOR EACH ROW EXECUTE PROCEDURE public.add_initial_asset_project();
