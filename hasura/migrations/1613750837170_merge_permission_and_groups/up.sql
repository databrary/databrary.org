CREATE OR REPLACE FUNCTION public.add_permissionet_and_groups()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
    DECLARE
        permissionset_id INTEGER;
        group_id INTEGER;
  BEGIN
    IF TG_OP = 'INSERT' THEN
      	IF NEW."permissionsetId" IS NULL THEN
      	    IF NEW."parentId" IS NOT NULL THEN
          	    SELECT "permissionsetId" INTO permissionset_id FROM assets WHERE id = NEW."parentId";
                NEW."permissionsetId" := permissionset_id;
            ELSE
                INSERT INTO permissionsets(ID) 
                    VALUES(DEFAULT)
                    RETURNING id INTO permissionset_id;
                NEW."permissionsetId" := permissionset_id;
                INSERT INTO groups("name", "groupType", "createdById")
            	    VALUES('auto', 'auto', NEW."createdById")
            	    RETURNING id INTO group_id;
                INSERT INTO groups_users("groupId", "userId")
            	    VALUES(group_id, NEW."createdById");
                INSERT INTO groups_admins("groupId", "userId")
            	    VALUES(group_id, NEW."createdById");
                INSERT INTO permissions("groupId", "permission", "permissionsetId")
                    VALUES(group_id, 'admin', NEW."permissionsetId");
            END IF;
        ELSE
            RAISE NOTICE 'Cannot Insert permissionsetId, operation not allowed';
    	END IF;
	END IF;
    RETURN NEW;
  END;
$function$;
