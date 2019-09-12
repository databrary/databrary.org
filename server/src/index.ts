import * as _ from 'lodash'
import express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import * as casual from 'casual'
import config from 'config'
import { AppModule } from './modules'
import { setup } from './database'

// const queue = new PgBoss(`postgres://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}/${dbConfig.database}`)

const app = express()

async function main () {
  const knex = await setup()
  const server = new ApolloServer({
    schema: AppModule.schema,
    context: {
      knex,
      userId: 1
    }
  })

  server.applyMiddleware({ app, path: '/graphql' })

  const port: number = config.get('port')
  app.listen({ port }, () =>
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
  )
}

// tslint:disable-next-line: no-floating-promises
main()
