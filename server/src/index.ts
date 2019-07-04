import * as _ from 'lodash'
import * as express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import * as casual from 'casual'
import * as config from 'config'

import { builder as graphQlBuilder } from 'objection-graphql'

import { Model } from 'objection'
import * as Knex from 'knex'
import * as knexConfig from '../knexfile'
export const knex = Knex(knexConfig.development)
Model.knex(knex)

// Can use https://github.com/Vincit/objection-graphql/blob/access-control/examples/access-control/src/schema.js
import User from './models/User'
import Project from './models/Project'
import Permission from './models/Permission'

const graphQlSchema = graphQlBuilder()
  .model(User, {
    fieldName: 'user',
    listFieldName: 'users'
  })
  .model(Project, {
    fieldName: 'project',
    listFieldName: 'projects'
  })
  .build()

const app = express()

async function main () {
  await knex.migrate.down()
  await knex.migrate.up()
  
  await (User as any).query().insertGraph({
    fullName: 'Jeffrey Spies',
    projects: [
      {
        title: 'Project 1',
        _isHidden: true
      },
      {
        title: 'Project 2'
      },
      {
        title: 'Project 3'
      }
    ]
  })

  await (Permission as any).query().insertGraph([{
    userId: 1,
    assetId: 2,
    type: 'read'
  },{
    userId: 1,
    assetId: 3,
    type: 'read'
  }])

  const server = new ApolloServer({
    schema: graphQlSchema,
    rootValue: (ast) => ({
      onQuery: async (builder) => {
        await builder.mergeContext({
          userId: '1'
        })
      }
    }),
    // context: ({ req, res }) => {
    //   return {
    //     user: 'jeff'
    //   }
    // }
    // schema: AppModule.schema,
    // context: session => session,
  })
  server.applyMiddleware({ app })

  const port: number = config.get('port')
  app.listen({ port }, () =>
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
  )
}

// tslint:disable-next-line: no-floating-promises
main()
