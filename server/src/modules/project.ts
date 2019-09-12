import { gql } from 'apollo-server-express'
import { GraphQLModule } from '@graphql-modules/core'
import { buildResolver } from '../util/parser'
import { rules } from '../rules'

export const ProjectModule = new GraphQLModule({
  typeDefs: gql`
    type Group {
      name: String
    }

    type Project {
      id: Int
      name: String
      groups: [Group]
    }

    type Query {
      project (id: Int!): Project
      projects: [Project]
      group: Group
    }
  `,
  resolvers: {
    Query: {
      project: (parent, args, context, data) => {
        const ast = (data.fieldNodes)[0]
        return [
          {
            id: 3,
            name: 'jeff'
          }
        ][0]
      },
      projects: async (parent, args,  context, data) => {
        const ast = (data.fieldNodes)[0]
        const userId = context.userId
        const knex = context.knex
        const result = await buildResolver(knex, ast, rules)
        return result
      }
    }
  },
  context: session => session
})
