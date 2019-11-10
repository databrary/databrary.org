import PgBoss from 'pg-boss'

import {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  PGBOSS_DATABASE
} from './config'

const boss = new PgBoss('postgres://user:pass@host/database')

export function run (fn, params, queue) {
  let jobId = await boss.publish(queue, { param1: 'parameter1' })

}

export function worker () {

}
