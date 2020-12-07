CREATE OR REPLACE FUNCTION public.update_projects_stats()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
	DECLARE
        files_count INTEGER;
        folders_count INTEGER;
        project_id INTEGER;
  BEGIN
    -- If the insert has a parent, we need to update the parent files and folders count
    IF NEW."parentId" IS NOT NULL THEN
        CREATE TEMPORARY TABLE IF NOT EXISTS temp_table AS
            WITH RECURSIVE find_roots("id", "name", "assetType", "parentId", "root") AS (
                -- Find direct descendent
                SELECT a1."id", a1."name", a1."assetType", a1."parentId", a1."parentId"
                FROM assets AS a1
                LEFT JOIN assets AS a2 ON a1."parentId" = a2."id"
                WHERE a2."assetType" = 'project'
                UNION
                    -- the children of the descendent
                    SELECT a3."id", a3."name", a3."assetType", a3."parentId", s."root"
                    FROM find_roots AS s
                    INNER JOIN assets AS a3 ON s.id = a3."parentId"
            ) SELECT * FROM find_roots;
        
        SELECT root INTO project_id FROM temp_table WHERE id = NEW."id";
        
        SELECT count(id) INTO files_count FROM temp_table WHERE root = project_id AND "assetType" = 'file' GROUP BY root, "assetType";
        SELECT count(id) INTO folders_count FROM temp_table WHERE root = project_id AND "assetType" = 'folder' GROUP BY root, "assetType";
        
        IF files_count IS NULL THEN
            files_count := 0;
        END IF;
        
        IF folders_count IS NULL THEN
            folders_count := 0;
        END IF;

            
        UPDATE projects SET "filesCount" = files_count, "foldersCount" = folders_count WHERE "assetId" = project_id;

        DROP TABLE temp_table;
    END IF;
    RETURN NULL;
  END;
$function$;
CREATE TRIGGER update_projects_stats_trigger AFTER INSERT OR DELETE ON public.assets FOR EACH ROW EXECUTE PROCEDURE public.update_projects_stats();
