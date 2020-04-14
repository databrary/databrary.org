CREATE FUNCTION public.add_asset_group() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	DECLARE
		group_id INTEGER;
  BEGIN
    INSERT INTO groups(name, group_type, created_by_id)
	    values('auto', 'auto', NEW.created_by_id)
	    RETURNING id INTO group_id;
    INSERT INTO groups_users(group_id, user_id)
	    values(group_id, NEW.created_by_id);
    INSERT INTO groups_admins(group_id, user_id)
	    values(group_id, NEW.created_by_id);
    INSERT INTO permissions(group_id, permission, permissionset_id)
      VALUES(group_id, 'admin', NEW.permissionset_id);
    RETURN NULL;
  END;
$$;
CREATE FUNCTION public.create_permissionsets() RETURNS integer
    LANGUAGE sql
    AS $$
	INSERT INTO permissionsets(ID) 
    VALUES(DEFAULT)
    returning id;
$$;
ALTER TABLE ONLY public.assets ALTER COLUMN permissionset_id SET DEFAULT public.create_permissionsets();
CREATE TRIGGER create_inital_asset_permissions AFTER INSERT ON public.assets FOR EACH ROW EXECUTE PROCEDURE public.add_asset_group();