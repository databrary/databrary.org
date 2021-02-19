CREATE TRIGGER add_add_permissionet_and_groups_trigger BEFORE INSERT ON public.assets FOR EACH ROW EXECUTE PROCEDURE public.add_permissionet_and_groups();
