import PgBoss from 'pg-boss'

import {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  PGBOSS_DATABASE
} from '../config'

const boss = new PgBoss(`postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost/${PGBOSS_DATABASE}`)

export default boss
