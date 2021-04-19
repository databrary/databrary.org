CREATE OR REPLACE FUNCTION public.add_projects()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
  BEGIN
  	IF TG_OP = 'INSERT' AND NEW."assetType" = 'project' THEN
	    INSERT INTO projects("assetId", "description", "lastChanged", "filesCount", "foldersCount", "color", "imageId", "useImage", "urls", "doi", "collaborators")
	        VALUES (NEW."id", DEFAULT, DEFAULT, DEFAULT, DEFAULT, NULL, NULL, DEFAULT, DEFAULT, NULL, CAST('[{"id": ' || NEW."createdById" || ', "permission": "Administrator", "bibliographic": true }]' AS jsonb));
	END IF;
    RETURN NEW;
  END;
$function$;
