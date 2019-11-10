import envfile from 'envfile'

const env = envfile.parseFileSync('../.env')

export const POSTGRES_USER: string = env.POSTGRES_USER
export const POSTGRES_PASSWORD: string = env.POSTGRES_PASSWORD

export const APP_PORT: number = env.APP_PORT
export const HASURA_PORT: number = env.HASURA_PORT

export const SESSION_SECRET: number = env.SESSION_SECRET
export const PGBOSS_DATABASE: string = env.PGBOSS_DATABASE

export const USE_KEYCLOAK: boolean = JSON.parse(env.USE_KEYCLOAK)

export const KEYCLOAK_PORT: number = env.KEYCLOAK_PORT
export const KEYCLOAK_REALM: string = env.KEYCLOAK_REALM
export const KEYCLOAK_CLIENT_ID: string = env.KEYCLOAK_CLIENT_ID
export const KEYCLOAK_CLIENT_SECRET: string = env.KEYCLOAK_CLIENT_SECRET

export const DUMMY_USER_EMAIL: string = env.DUMMY_USER_EMAIL
export const DUMMY_USER_AUTH_SERVER_ID: string = env.DUMMY_USER_AUTH_SERVER_ID
export const DUMMY_USER_FULL_NAME: string = env.DUMMY_USER_FULL_NAME

export const MINIO_ACCESS_KEY: string = env.MINIO_ACCESS_KEY
export const MINIO_SECRET_KEY: string = env.MINIO_SECRET_KEY
