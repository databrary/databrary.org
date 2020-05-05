import _ from 'lodash'
import gql from 'graphql-tag'
import fs from 'fs-extra'
import { createAdminClient } from './utils'

// Do not export the client admin, export only adminQuery and adminMutate
const adminClient = createAdminClient()
const cache = {}

// TODO(Reda): need to fix the fetch policy
export async function adminQuery (
  path: string,
  variables?: object
) {
  if (cache[path] === undefined) {
    const fileContent = await fs.readFile(path)
    cache[path] = gql`${fileContent}`
  }
  const response = await adminClient.query({
    query: cache[path],
    fetchPolicy: 'no-cache', // This is needed for fetching the last avatar
    variables
  })
  return _.first(_.values(response.data))
}

export async function adminMutate (
  path: string,
  variables?: object
) {
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
