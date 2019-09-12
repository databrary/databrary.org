import Knex from 'knex'
import knexConfig from '../knexfile'

// import * as PgBoss from 'pg-boss'

export async function setup() {
  const knex = Knex(knexConfig.development)
  await knex.raw("SELECT 'test connection';")
  return knex
}
// const dbConfig = _.defaults(
//   knex['_context'].client.config.connection,
//   knex['_context'].client.driver.defaults
// )