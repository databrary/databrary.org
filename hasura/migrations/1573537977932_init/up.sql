CREATE FUNCTION public.utcnow() RETURNS timestamp without time zone
    LANGUAGE sql
    AS $$
  select timezone('utc'::text, now())
$$;

CREATE TABLE public.asset_types (
    id text,
    comment text,
    PRIMARY KEY ("id")
);

INSERT INTO asset_types VALUES ('project'), ('file');

CREATE TABLE public.group_types (
    id text,
    comment text,
    PRIMARY KEY ("id")
);

INSERT INTO group_types VALUES ('enclave'), ('auto'), ('user');

CREATE TABLE public.permission_types (
    id text,
    comment text,
    PRIMARY KEY ("id")
);

INSERT INTO permission_types VALUES ('read'), ('write'), ('admin');

CREATE TABLE public.privacy_types (
    id text,
    comment text,
    PRIMARY KEY ("id")
);

INSERT INTO privacy_types VALUES ('private'), ('public');

CREATE TABLE public.assets (
    id SERIAL,
    asset_type text NOT NULL,
    name text NOT NULL,
    created_by_id integer,
    datetime_created timestamp with time zone DEFAULT public.utcnow() NOT NULL,
    permissionset_id integer, --DEFAULT public.create_permissionsets(),
    privacy_type text DEFAULT 'private'::text NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE public.groups (
    id SERIAL,
    name text NOT NULL,
    group_type text NOT NULL,
    created_by_id integer,
    PRIMARY KEY ("id")
);
CREATE TABLE public.groups_admins (
    id SERIAL,
    group_id integer NOT NULL,
    user_id integer NOT NULL,
    PRIMARY KEY ("id")
);
CREATE TABLE public.groups_users (
    id SERIAL,
    group_id integer NOT NULL,
    user_id integer NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE public.permissions (
    id SERIAL,
    group_id integer NOT NULL,
    permission text NOT NULL,
    permissionset_id integer NOT NULL,
    PRIMARY KEY ("id")
);

CREATE TABLE public.fileobjects (
    id SERIAL,
    location text,
    size integer,
    md5 text,
    sha1 text,
    sha256 text,
    PRIMARY KEY ("id")
);
CREATE TABLE public.files (
    id SERIAL,
    name text NOT NULL,
    uploaded_by_id integer,
    fileobject_id integer,
    asset_id integer,
    PRIMARY KEY ("id")
);

CREATE TABLE public.permissionsets (
    id SERIAL,
    PRIMARY KEY ("id")
);

CREATE TABLE public.users (
    id SERIAL,
    auth_server_id text UNIQUE,
    email_primary text UNIQUE,
    datetime_registered timestamp with time zone DEFAULT public.utcnow() NOT NULL,
    display_full_name text,
    PRIMARY KEY ("id")
);

ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_created_by_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_permissionset_id_fkey FOREIGN KEY (permissionset_id) REFERENCES public.permissionsets(id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_privacy_type_fkey FOREIGN KEY (privacy_type) REFERENCES public.privacy_types(id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_type_fkey FOREIGN KEY (asset_type) REFERENCES public.asset_types(id);
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_uploaded_by_fkey FOREIGN KEY (uploaded_by_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id);
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_fileobject_id_fkey FOREIGN KEY (fileobject_id) REFERENCES public.fileobjects(id);
ALTER TABLE ONLY public.groups_admins
    ADD CONSTRAINT group_admins_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);
ALTER TABLE ONLY public.groups_admins
    ADD CONSTRAINT group_admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT groups_permissions_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);
ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT groups_permissions_permission_id_fkey FOREIGN KEY (permission) REFERENCES public.permission_types(id);
ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_type_id_fkey FOREIGN KEY (group_type) REFERENCES public.group_types(id);
ALTER TABLE ONLY public.groups_users
    ADD CONSTRAINT groups_users_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);
ALTER TABLE ONLY public.groups_users
    ADD CONSTRAINT groups_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_permissionset_id_fkey FOREIGN KEY (permissionset_id) REFERENCES public.permissionsets(id);
