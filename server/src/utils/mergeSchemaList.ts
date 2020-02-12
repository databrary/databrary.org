import * as _ from 'lodash'
import fetch from 'node-fetch'
import pMap from 'p-map'
import { introspectSchema, makeExecutableSchema, makeRemoteExecutableSchema, mergeSchemas } from 'graphql-tools'
import { HttpLink } from 'apollo-link-http'

export async function mergeSchemaList (schemas: any) {
  const executableSchemas = await pMap(schemas, async (schema: any) => {
    if (_.isString(schema)) {
      const link = new HttpLink({
        uri: schema,
        fetch,
        headers: { 'x-hasura-admin-secret': 'mysecret' }
      })
      const urlSchema = await introspectSchema(link)
      const urlExecutableSchema = makeRemoteExecutableSchema({
        schema: urlSchema,
        link
      })
      return urlExecutableSchema
    } else if (_.isPlainObject(schema) && _.has(schema, 'typeDefs') && _.has(schema, 'resolvers')) {
      const appExecutableSchema = makeExecutableSchema({
        typeDefs: schema.typeDefs,
        resolvers: schema.resolvers
      })
      return appExecutableSchema
    } else {
      throw Error('Schema of incorrect format')
    }
  })

  return mergeSchemas({
    schemas: executableSchemas
  })
}
