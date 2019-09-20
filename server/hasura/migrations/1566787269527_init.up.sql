CREATE TABLE public."assetTypes" (
    id integer NOT NULL,
    label text NOT NULL
);
CREATE SEQUENCE public."assetTypes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."assetTypes_id_seq" OWNED BY public."assetTypes".id;
CREATE TABLE public.groups (
    id integer NOT NULL,
    name text NOT NULL
);
CREATE SEQUENCE public.groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;
CREATE TABLE public.groups_permissionsets (
    id integer NOT NULL,
    "groupId" integer NOT NULL,
    "permissionsetId" integer NOT NULL,
    "permissionTypeId" integer NOT NULL
);
CREATE SEQUENCE public.groups_permissionsets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.groups_permissionsets_id_seq OWNED BY public.groups_permissionsets.id;
CREATE TABLE public.groups_users (
    id integer NOT NULL,
    "groupId" integer NOT NULL,
    "userId" integer NOT NULL
);
CREATE SEQUENCE public."groups_users_groupId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."groups_users_groupId_seq" OWNED BY public.groups_users."groupId";
CREATE SEQUENCE public.groups_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.groups_users_id_seq OWNED BY public.groups_users.id;
CREATE SEQUENCE public."groups_users_userId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."groups_users_userId_seq" OWNED BY public.groups_users."userId";
CREATE TABLE public."permissionTypes" (
    id integer NOT NULL,
    label text NOT NULL
);
CREATE SEQUENCE public."permissionTypes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public."permissionTypes_id_seq" OWNED BY public."permissionTypes".id;
CREATE TABLE public.permissionsets (
    id integer NOT NULL,
    "sourceId" integer NOT NULL,
    "sourceAssetTypeId" integer NOT NULL
);
CREATE SEQUENCE public.permissionsets_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.permissionsets_id_seq OWNED BY public.permissionsets.id;
CREATE TABLE public.users (
    id integer NOT NULL,
    "authId" text NOT NULL,
    "fullName" text NOT NULL
);
CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE ONLY public."assetTypes" ALTER COLUMN id SET DEFAULT nextval('public."assetTypes_id_seq"'::regclass);
ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);
ALTER TABLE ONLY public.groups_permissionsets ALTER COLUMN id SET DEFAULT nextval('public.groups_permissionsets_id_seq'::regclass);
ALTER TABLE ONLY public.groups_users ALTER COLUMN id SET DEFAULT nextval('public.groups_users_id_seq'::regclass);
ALTER TABLE ONLY public.groups_users ALTER COLUMN "groupId" SET DEFAULT nextval('public."groups_users_groupId_seq"'::regclass);
ALTER TABLE ONLY public.groups_users ALTER COLUMN "userId" SET DEFAULT nextval('public."groups_users_userId_seq"'::regclass);
ALTER TABLE ONLY public."permissionTypes" ALTER COLUMN id SET DEFAULT nextval('public."permissionTypes_id_seq"'::regclass);
ALTER TABLE ONLY public.permissionsets ALTER COLUMN id SET DEFAULT nextval('public.permissionsets_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public."assetTypes"
    ADD CONSTRAINT "assetTypes_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public.groups_permissionsets
    ADD CONSTRAINT groups_permissionsets_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.groups_users
    ADD CONSTRAINT groups_users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public."permissionTypes"
    ADD CONSTRAINT "permissionTypes_pkey" PRIMARY KEY (id);
ALTER TABLE ONLY public.permissionsets
    ADD CONSTRAINT permissionsets_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.groups_permissionsets
    ADD CONSTRAINT "groups_permissionsets_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.groups(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.groups_permissionsets
    ADD CONSTRAINT "groups_permissionsets_permissionTypeId_fkey" FOREIGN KEY ("permissionTypeId") REFERENCES public."permissionTypes"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.groups_permissionsets
    ADD CONSTRAINT "groups_permissionsets_permissionsetId_fkey" FOREIGN KEY ("permissionsetId") REFERENCES public.permissionsets(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.groups_users
    ADD CONSTRAINT "groups_users_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES public.groups(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.groups_users
    ADD CONSTRAINT "groups_users_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.permissionsets
    ADD CONSTRAINT "permissionsets_sourceAssetTypeId_fkey" FOREIGN KEY ("sourceAssetTypeId") REFERENCES public."assetTypes"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
