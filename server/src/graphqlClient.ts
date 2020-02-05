import { createAdminClient } from './utils/createGqlClient'
import { importSchema } from 'graphql-import'
import gql from 'graphql-tag'
import _ from 'lodash'
import fs from 'fs-extra'
import { logger } from '@shared'

const client = createAdminClient()
const cache = {}

export const adminClient = client

export async function adminQuery (
  path: string,
  variables?: object
) {
  logger.debug('Running Admin Query')
  if (cache[path] === undefined) {
    const fileContent = await fs.readFile(path)
    cache[path] = gql`${fileContent}`
  }
  const response = await adminClient.query({
    query: cache[path],
    variables
  })
  return _.first(_.values(response.data))
}

export async function adminMutate (
  path: string,
  variables?: object
) {
  logger.debug('Running Admin Mutate')
  if (cache[path] === undefined) {
    const fileContent = await fs.readFile(path)
    cache[path] = gql`${fileContent}`
  }
  const response = await adminClient.mutate({
    mutation: cache[path],
    variables
  })
  return _.first(_.values(response.data))
}

export default client
