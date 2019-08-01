import { gql } from 'apollo-server-express'
import { GraphQLModule } from '@graphql-modules/core'

export const ProjectModule = new GraphQLModule({
  typeDefs: gql`
    type Group {
      name: String
    }

    type Project {
      id: Int
      name: String
      group: Group
    }

    type Query {
      project (id: Int!): Project
      group: Group
    }
  `,
  resolvers: {
    Query: {
      project: (parent, args, context, info) => {
        // console.log(JSON.stringify(parse(info.fieldNodes), null, 2))
        // return getProject({
        //   id: args.id
        // })
        // const knex = op.session.knex
        // const userId = op.session.userId
        console.log('project',
          info
        )
        return {
          id: 3,
          name: 'jeff'
        }
      }
    }
  }
})
