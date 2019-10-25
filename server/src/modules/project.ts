import { gql } from 'apollo-server-express'
import { GraphQLModule } from '@graphql-modules/core'

import client from '../graphqlClient'

export const ProjectModule = new GraphQLModule({
  typeDefs: gql`
    type Query {
      dummy: String
    }
    type Mutation {
      createPost(title: String): String!
    }`,
  resolvers: {
    Query: {
      dummy: () => 'hi'
    },
    Mutation: {
      createPost: async (parent, { title }) => {
        const results = await client.mutate({
          mutation: gql`
            mutation {
              insert_projects( objects: { title: "${title}" }) {
                returning {
                  id
                }
              }
            }
          `
        })
      }
    }
  }
})
