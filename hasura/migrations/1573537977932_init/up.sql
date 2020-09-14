CREATE FUNCTION public.utcnow() RETURNS timestamp without time zone
    LANGUAGE sql
    AS $$
  select timezone('utc'::text, now())
$$;
CREATE TABLE public.assets (
    id integer NOT NULL,
    asset_type text NOT NULL,
    name text NOT NULL,
    created_by_id integer,
    datetime_created timestamp with time zone DEFAULT public.utcnow() NOT NULL,
    permissionset_id integer,
    privacy_type text DEFAULT 'private'::text NOT NULL
);
CREATE TABLE public.groups (
    id integer NOT NULL,
    name text NOT NULL,
    group_type text NOT NULL,
    created_by_id integer
);
CREATE TABLE public.asset_types (
    id text NOT NULL,
    comment text
);
INSERT INTO public.asset_types VALUES ('project');
INSERT INTO public.asset_types VALUES ('file');
INSERT INTO public.asset_types VALUES ('avatar');
INSERT INTO public.asset_types VALUES ('folder');
CREATE SEQUENCE public.assets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.assets_id_seq OWNED BY public.assets.id;
CREATE TABLE public.fileobjects (
    id integer NOT NULL,
    location text,
    size integer,
    md5 text,
    sha1 text,
    sha256 text
);
CREATE SEQUENCE public.fileobjects_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.fileobjects_id_seq OWNED BY public.fileobjects.id;
CREATE TABLE public.files (
    id integer NOT NULL,
    name text NOT NULL,
    uploaded_by_id integer NOT NULL,
    fileobject_id integer,
    asset_id integer NOT NULL,
    uploadedDatetime timestamp
);
CREATE SEQUENCE public.files_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;
CREATE TABLE public.group_types (
    id text NOT NULL,
    comment text
);
INSERT INTO public.group_types VALUES ('auto');
CREATE TABLE public.groups_admins (
    id integer NOT NULL,
    group_id integer NOT NULL,
    user_id integer NOT NULL
);
CREATE SEQUENCE public.groups_admins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.groups_admins_id_seq OWNED BY public.groups_admins.id;
CREATE SEQUENCE public.groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;
CREATE TABLE public.groups_users (
    id integer NOT NULL,
    group_id integer NOT NULL,
    user_id integer NOT NULL
);
CREATE SEQUENCE public.groups_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.groups_users_id_seq OWNED BY public.groups_users.id;
CREATE TABLE public.permission_types (
    id text NOT NULL,
    comment text
);
INSERT INTO public.permission_types VALUES ('read');
INSERT INTO public.permission_types VALUES ('write');
INSERT INTO public.permission_types VALUES ('admin');
CREATE TABLE public.permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission text NOT NULL,
    permissionset_id integer NOT NULL
);
CREATE SEQUENCE public.permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permissions.id;
CREATE TABLE public.permissionsets (
    id integer NOT NULL
);
CREATE SEQUENCE public.permissionsets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.permissionsets_id_seq OWNED BY public.permissionsets.id;
CREATE TABLE public.privacy_types (
    id text NOT NULL,
    comment text
);
INSERT INTO public.privacy_types VALUES ('private');
INSERT INTO public.privacy_types VALUES ('public');
CREATE TABLE public.users (
    id integer NOT NULL,
    auth_server_id text,
    email_primary text,
    datetime_registered timestamp with time zone DEFAULT public.utcnow() NOT NULL,
    display_full_name text
);
CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE ONLY public.assets ALTER COLUMN id SET DEFAULT nextval('public.assets_id_seq'::regclass);
ALTER TABLE ONLY public.fileobjects ALTER COLUMN id SET DEFAULT nextval('public.fileobjects_id_seq'::regclass);
ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);
ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);
ALTER TABLE ONLY public.groups_admins ALTER COLUMN id SET DEFAULT nextval('public.groups_admins_id_seq'::regclass);
ALTER TABLE ONLY public.groups_users ALTER COLUMN id SET DEFAULT nextval('public.groups_users_id_seq'::regclass);
ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);
ALTER TABLE ONLY public.permissionsets ALTER COLUMN id SET DEFAULT nextval('public.permissionsets_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.asset_types
    ADD CONSTRAINT asset_types_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.fileobjects
    ADD CONSTRAINT fileobjects_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.group_types
    ADD CONSTRAINT group_types_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.groups_admins
    ADD CONSTRAINT groups_admins_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.groups_users
    ADD CONSTRAINT groups_users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.permission_types
    ADD CONSTRAINT permission_types_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.permissionsets
    ADD CONSTRAINT permissionsets_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.privacy_types
    ADD CONSTRAINT privacy_types_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_auth_server_id_key UNIQUE (auth_server_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_primary_key UNIQUE (email_primary);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_created_by_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_permissionset_id_fkey FOREIGN KEY (permissionset_id) REFERENCES public.permissionsets(id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_privacy_type_fkey FOREIGN KEY (privacy_type) REFERENCES public.privacy_types(id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_type_fkey FOREIGN KEY (asset_type) REFERENCES public.asset_types(id);
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id);
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_fileobject_id_fkey FOREIGN KEY (fileobject_id) REFERENCES public.fileobjects(id);
ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_uploaded_by_fkey FOREIGN KEY (uploaded_by_id) REFERENCES public.users(id);
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
