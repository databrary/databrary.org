CREATE OR REPLACE FUNCTION public.add_projects()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
  BEGIN
  	IF TG_OP = 'INSERT' AND NEW."assetType" = 'project' THEN
  	    IF NEW."collaborators" IS NULL THEN
		    INSERT INTO projects("assetId", "description", "lastChanged", "filesCount", "foldersCount", "color", "imageId", "useImage", "urls", "doi", "collaborators")
			    VALUES (NEW."id", DEFAULT, DEFAULT, DEFAULT, DEFAULT, NULL, NULL, DEFAULT, DEFAULT, NULL,'[{"id": ' || NEW."createdById" || ', "permission": "Administrator", "bibliographic": true }]');
	    ELSE
	        INSERT INTO projects("assetId")
			    VALUES (NEW."id");
	    END IF;
	END IF;
    RETURN NEW;
  END;
$function$;
