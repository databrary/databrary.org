CREATE OR REPLACE FUNCTION public.add_projects()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
  BEGIN
  	IF TG_OP = 'INSERT' AND NEW."assetType" = 'project' THEN
		INSERT INTO projects("assetId", "description", "lastChanged", "filesCount", "foldersCount")
			VALUES (NEW."id", DEFAULT, DEFAULT, DEFAULT, DEFAULT);
	END IF;
    RETURN NEW;
  END;
$function$;
CREATE TRIGGER create_inital_project AFTER INSERT ON public.assets FOR EACH ROW EXECUTE PROCEDURE public.add_projects();
