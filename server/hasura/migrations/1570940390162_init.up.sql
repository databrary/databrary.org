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
CREATE TABLE public.assets (
    id integer NOT NULL,
    type_id integer NOT NULL,
    name text NOT NULL,
    created_by_id integer NOT NULL
);
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
CREATE TABLE public.users (
    id integer NOT NULL,
    auth_server_id text NOT NULL,
    email_primary text NOT NULL,
    registration_datetime timestamp with time zone DEFAULT now() NOT NULL,
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
ALTER TABLE ONLY public.assets ALTER COLUMN created_by_id SET DEFAULT nextval('public.assets_created_by_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.asset_types
    ADD CONSTRAINT asset_types_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_auth_server_id_key UNIQUE (auth_server_id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_primary_key UNIQUE (email_primary);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_created_by_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);
ALTER TABLE ONLY public.assets
    ADD CONSTRAINT assets_type_fkey FOREIGN KEY (type_id) REFERENCES public.asset_types(id);
