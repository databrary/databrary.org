CREATE OR REPLACE FUNCTION public.add_asset_group()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
	DECLARE
		groupId INTEGER;
  BEGIN
    INSERT INTO groups("name", "groupType", "createdById")
	    values('auto', 'auto', NEW."createdById")
	    RETURNING id INTO groupId;
    INSERT INTO groups_users("groupId", "userId")
	    values(groupId, NEW."createdById");
    INSERT INTO groups_admins("groupId", "userId")
	    values(groupId, NEW."createdById");
    INSERT INTO permissions("groupId", "permission", "permissionsetId")
      VALUES(groupId, 'admin', NEW."permissionsetId");
    RETURN NULL;
  END;
$function$;
