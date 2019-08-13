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
        console.log(context.userId)
        // console.log(JSON.stringify(ast))
        return [
          {
            id: 3,
            name: 'jeff'
          }
        ][0]
      },
      projects: async (parent, args, context, data) => {
        const ast = (data.fieldNodes)[0]
        console.log(context.userId)
        const result = await buildResolver(context.knex, ast, rules)
        return result
      }
    }
    // Project: {
    //   group: (parent, args, context, info) => {
    //     console.log(info)
    //     return {
    //       name: 'admins'
    //     }
    //   }
    // }
  }
})
