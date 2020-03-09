CREATE FUNCTION public.add_avatar_asset() RETURNS trigger
    LANGUAGE plpgsql 
    AS $$
  BEGIN
    INSERT INTO assets(asset_type, name, created_by_id, privacy_type)
      values('avatar', CONCAT('User ', NEW.id ,' Avatar'), NEW.id, 'public');
    RETURN NULL;
  END;
$$;
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
CREATE TRIGGER create_avatar_asset AFTER INSERT ON public.users FOR EACH ROW EXECUTE PROCEDURE public.add_avatar_asset(); 