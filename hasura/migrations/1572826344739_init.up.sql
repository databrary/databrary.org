CREATE FUNCTION public.add_asset_group() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	DECLARE
		group_id INTEGER;
  BEGIN
    INSERT INTO groups(name, type_id, created_by_id)
	    values('auto', 2, NEW.created_by_id)
	    RETURNING id INTO group_id;
    INSERT INTO groups_users(group_id, user_id)
	    values(group_id, NEW.created_by_id);
    INSERT INTO groups_admins(group_id, user_id)
	    values(group_id, NEW.created_by_id);
    INSERT INTO permissions(group_id, permission_id, permissionset_id)
      VALUES(group_id, 3, NEW.permissionset_id);
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
CREATE FUNCTION public.utcnow() RETURNS timestamp without time zone
    LANGUAGE sql
    AS $$
  select timezone('utc'::text, now())
$$;
CREATE TABLE public.assets (
    id integer NOT NULL,
    type_id integer NOT NULL,
    name text NOT NULL,
    created_by_id integer NOT NULL,
    datetime_created timestamp with time zone DEFAULT public.utcnow() NOT NULL,
    permissionset_id integer DEFAULT public.create_permissionsets(),
    privacy_type_id integer DEFAULT 1 NOT NULL
);
CREATE TABLE public.groups (
    id integer NOT NULL,
    name text NOT NULL,
    type_id integer NOT NULL,
    created_by_id integer
);
CREATE TABLE public.groups_admins (
    id integer NOT NULL,
    group_id integer NOT NULL,
    user_id integer NOT NULL
);
CREATE TABLE public.groups_users (
    id integer NOT NULL,
    group_id integer NOT NULL,
    user_id integer NOT NULL
);
CREATE TABLE public.asset_types (
    id integer NOT NULL,
    name text NOT NULL
);
CREATE SEQUENCE public.asset_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.asset_types_id_seq OWNED BY public.asset_types.id;
CREATE SEQUENCE public.assets_created_by_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.assets_created_by_seq OWNED BY public.assets.created_by_id;
CREATE SEQUENCE public.assets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.assets_id_seq OWNED BY public.assets.id;
CREATE SEQUENCE public.group_admins_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.group_admins_id_seq OWNED BY public.groups_admins.id;
CREATE TABLE public.group_types (
    id integer NOT NULL,
    name text NOT NULL
);
CREATE SEQUENCE public.group_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.group_types_id_seq OWNED BY public.group_types.id;
CREATE SEQUENCE public.groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;
CREATE TABLE public.permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL,
    permissionset_id integer NOT NULL
);
CREATE SEQUENCE public.groups_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.groups_permissions_id_seq OWNED BY public.permissions.id;
CREATE SEQUENCE public.groups_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.groups_users_id_seq OWNED BY public.groups_users.id;
CREATE TABLE public.permission_types (
    id integer NOT NULL,
    name text NOT NULL
);
CREATE SEQUENCE public.permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.permissions_id_seq OWNED BY public.permission_types.id;
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
    id integer NOT NULL,
    name text NOT NULL
);
CREATE SEQUENCE public.privacy_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.privacy_types_id_seq OWNED BY public.privacy_types.id;
CREATE TABLE public.users (
    id integer NOT NULL,
    auth_server_id text NOT NULL,
    email_primary text NOT NULL,
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
ALTER TABLE ONLY public.asset_types ALTER COLUMN id SET DEFAULT nextval('public.asset_types_id_seq'::regclass);
ALTER TABLE ONLY public.assets ALTER COLUMN id SET DEFAULT nextval('public.assets_id_seq'::regclass);
ALTER TABLE ONLY public.group_types ALTER COLUMN id SET DEFAULT nextval('public.group_types_id_seq'::regclass);
ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);
ALTER TABLE ONLY public.groups_admins ALTER COLUMN id SET DEFAULT nextval('public.group_admins_id_seq'::regclass);
ALTER TABLE ONLY public.groups_users ALTER COLUMN id SET DEFAULT nextval('public.groups_users_id_seq'::regclass);
ALTER TABLE ONLY public.permission_types ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);
ALTER TABLE ONLY public.permissions ALTER COLUMN id SET DEFAULT nextval('public.groups_permissions_id_seq'::regclass);
ALTER TABLE ONLY public.permissionsets ALTER COLUMN id SET DEFAULT nextval('public.permissionsets_id_seq'::regclass);
ALTER TABLE ONLY public.privacy_types ALTER COLUMN id SET DEFAULT nextval('public.privacy_types_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.asset_types
    ADD CONSTRAINT asset_types_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.groups_admins
    ADD CONSTRAINT group_admins_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.group_types
    ADD CONSTRAINT group_types_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT groups_permissions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.groups_users
    ADD CONSTRAINT groups_users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.permission_types
    ADD CONSTRAINT permission_types_id_key UNIQUE (id);
ALTER TABLE ONLY public.permission_types
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
CREATE TRIGGER create_inital_asset_permissions AFTER INSERT ON public.assets FOR EACH ROW EXECUTE PROCEDURE public.add_asset_group();
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_created_by_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_permissionset_id_fkey FOREIGN KEY (permissionset_id) REFERENCES public.permissionsets(id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_privacy_type_fkey FOREIGN KEY (privacy_type_id) REFERENCES public.privacy_types(id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_type_fkey FOREIGN KEY (type_id) REFERENCES public.asset_types(id);
ALTER TABLE ONLY public.groups_admins
    ADD CONSTRAINT group_admins_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);
ALTER TABLE ONLY public.groups_admins
    ADD CONSTRAINT group_admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT groups_permissions_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);
ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT groups_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permission_types(id);
ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.group_types(id);
ALTER TABLE ONLY public.groups_users
    ADD CONSTRAINT groups_users_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);
ALTER TABLE ONLY public.groups_users
    ADD CONSTRAINT groups_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_permissionset_id_fkey FOREIGN KEY (permissionset_id) REFERENCES public.permissionsets(id);
