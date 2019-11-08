-- ###########################################################################
-- Preferred over now() in default value assignment

CREATE OR REPLACE FUNCTION utcnow()
RETURNS TIMESTAMP
AS $$
  select timezone('utc'::text, now())
$$ LANGUAGE sql;

-- ###########################################################################
-- Called as default value for asset creation to get permissionset_id

CREATE OR REPLACE FUNCTION create_permissionsets()
RETURNS INTEGER
AS $$
	INSERT INTO permissionsets(ID) 
    VALUES(DEFAULT)
    returning id;
$$ LANGUAGE sql; 

-- ###########################################################################
-- Triggered on asset creation
 
CREATE OR replace FUNCTION add_asset_group()
RETURNS TRIGGER AS $add_asset_group$
	DECLARE
		group_id INTEGER;
  BEGIN
    -- 2 is generated
    INSERT INTO groups (name, type_id, created_by_id)
	    values('auto', 2, NEW.created_by_id)
	    RETURNING id INTO group_id;
    INSERT INTO groups_users (group_id, user_id)
	    values(group_id, NEW.created_by_id);
    INSERT INTO groups_admins (group_id, user_id)
	    values(group_id, NEW.created_by_id);
    -- 3 is admin
    INSERT INTO permissions (group_id, permission_id, permissionset_id)
      VALUES(group_id, 3, NEW.permissionset_id);
    RETURN NULL;
  END;
$add_asset_group$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS create_inital_asset_permissions ON assets;

CREATE TRIGGER create_inital_asset_permissions
AFTER INSERT ON assets 
FOR EACH ROW EXECUTE PROCEDURE add_asset_group();

-- ###########################################################################