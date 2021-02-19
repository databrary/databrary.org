CREATE OR REPLACE FUNCTION public.add_parent_permissionet()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
    DECLARE
        parent_permissionset INTEGER;
  BEGIN
  	IF NEW."parentId" IS NOT NULL THEN
  	    SELECT "permissionsetId" INTO parent_permissionset FROM assets WHERE id = NEW."parentId";
        NEW."permissionsetId" := parent_permissionset;
	END IF;
    RETURN NEW;
  END;
$function$;
