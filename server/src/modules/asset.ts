import { gql } from 'apollo-server-express'
import { GraphQLModule } from '@graphql-modules/core'

export const AssetModule = new GraphQLModule({
  typeDefs: gql`
    type Asset {
      id: Int
      name: String
    }

    type Query {
      asset: Asset
    }
  `,
  resolvers: {
    Query: {
      asset: () => {
        return {
          id: 1,
          name: 'jeff'
        }
      }
    }
  }
})
