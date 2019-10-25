CREATE TABLE public.assets (
    id integer NOT NULL,
    type_id integer NOT NULL,
    name text NOT NULL,
    created_by_id integer NOT NULL,
    datetime_created timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE TABLE public.assets_groups (
    id integer NOT NULL,
    asset_id integer NOT NULL,
    group_id integer NOT NULL
);
CREATE TABLE public.groups (
    id integer NOT NULL,
    name text NOT NULL,
    type_id integer NOT NULL
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
CREATE SEQUENCE public.assets_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.assets_groups_id_seq OWNED BY public.assets_groups.id;
CREATE SEQUENCE public.assets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.assets_id_seq OWNED BY public.assets.id;
CREATE TABLE public.users (
    id integer NOT NULL,
    auth_server_id text NOT NULL,
    email_primary text NOT NULL,
    datetime_registered timestamp with time zone DEFAULT now() NOT NULL,
    display_full_name text
);
CREATE VIEW public.contributors AS
 SELECT users.id,
    users.datetime_registered,
    users.display_full_name
   FROM public.users;
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
CREATE TABLE public.groups_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);
CREATE SEQUENCE public.groups_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.groups_permissions_id_seq OWNED BY public.groups_permissions.id;
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
CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE ONLY public.asset_types ALTER COLUMN id SET DEFAULT nextval('public.asset_types_id_seq'::regclass);
ALTER TABLE ONLY public.assets ALTER COLUMN id SET DEFAULT nextval('public.assets_id_seq'::regclass);
ALTER TABLE ONLY public.assets ALTER COLUMN created_by_id SET DEFAULT nextval('public.assets_created_by_seq'::regclass);
ALTER TABLE ONLY public.assets_groups ALTER COLUMN id SET DEFAULT nextval('public.assets_groups_id_seq'::regclass);
ALTER TABLE ONLY public.group_types ALTER COLUMN id SET DEFAULT nextval('public.group_types_id_seq'::regclass);
ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);
ALTER TABLE ONLY public.groups_permissions ALTER COLUMN id SET DEFAULT nextval('public.groups_permissions_id_seq'::regclass);
ALTER TABLE ONLY public.groups_users ALTER COLUMN id SET DEFAULT nextval('public.groups_users_id_seq'::regclass);
ALTER TABLE ONLY public.permission_types ALTER COLUMN id SET DEFAULT nextval('public.permissions_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.asset_types
    ADD CONSTRAINT asset_types_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.assets_groups
    ADD CONSTRAINT assets_groups_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.group_types
    ADD CONSTRAINT group_types_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.groups_permissions
    ADD CONSTRAINT groups_permissions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.groups_users
    ADD CONSTRAINT groups_users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.permission_types
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_auth_server_id_key UNIQUE (auth_server_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_primary_key UNIQUE (email_primary);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_created_by_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.assets_groups
    ADD CONSTRAINT assets_groups_asset_id_fkey FOREIGN KEY (asset_id) REFERENCES public.assets(id);
ALTER TABLE ONLY public.assets_groups
    ADD CONSTRAINT assets_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_type_fkey FOREIGN KEY (type_id) REFERENCES public.asset_types(id);
ALTER TABLE ONLY public.groups_permissions
    ADD CONSTRAINT groups_permissions_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);
ALTER TABLE ONLY public.groups_permissions
    ADD CONSTRAINT groups_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permission_types(id);
ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.group_types(id);
ALTER TABLE ONLY public.groups_users
    ADD CONSTRAINT groups_users_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);
ALTER TABLE ONLY public.groups_users
    ADD CONSTRAINT groups_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
