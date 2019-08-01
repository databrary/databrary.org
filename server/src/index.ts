import * as _ from 'lodash'
import * as express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import * as casual from 'casual'
import * as config from 'config'

import { AppModule } from './modules'

// import { builder as graphQlBuilder } from 'objection-graphql'

// import { Model } from 'objection'
import * as Knex from 'knex'
import * as knexConfig from '../knexfile'

import * as PgBoss from 'pg-boss'

const knex = Knex(knexConfig.development)
const dbConfig = _.defaults(
  knex['_context'].client.config.connection,
  knex['_context'].client.driver.defaults
)
// Model.knex(knex)

const queue = new PgBoss(`postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}/${dbConfig.database}`);

// Can use https://github.com/Vincit/objection-graphql/blob/access-control/examples/access-control/src/schema.js
// import User from './models/User'
// import Project from './models/Project'
// import Group from './models/Group'
// import Permission from './models/Permission'

// const graphQlSchema = graphQlBuilder()
//   .model(User, {
//     fieldName: 'user',
//     listFieldName: 'users'
//   })
//   .model(Project, {
//     fieldName: 'project',
//     listFieldName: 'projects'
//   })
//   .model(Group, {
//     fieldName: 'group',
//     listFieldName: 'groups'
//   })
//   .build()

const app = express()

async function main () {
  const server = new ApolloServer({
    schema: AppModule.schema,
    // rootValue: (ast) => ({
    //   onQuery: async (builder) => {
    //     await builder.mergeContext({
    //       userId: '1'
    //     })
    //   }
    // }),
    context: ({ req, res }) => ({
      knex,
      userId: 1
    })
  })

  const path = '/graphql'
  server.applyMiddleware({ app, path })

  const port: number = config.get('port')
  app.listen({ port }, () =>
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
  )
}

// tslint:disable-next-line: no-floating-promises
main()
