import PgBoss from 'pg-boss'
import '../config'

const boss = new PgBoss(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost/${process.env.PGBOSS_DATABASE}`)

export default boss
