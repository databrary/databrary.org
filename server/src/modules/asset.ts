import { gql } from 'apollo-server-express'
import { GraphQLModule } from '@graphql-modules/core'

export const AssetModule = new GraphQLModule({
  name: 'asset',
  typeDefs: gql`
    type Asset {
      id: Int
      name: String
    }
  `
  // resolvers: {
  //   Query: {
  //     asset: () => {
  //       return {
  //         id: 1,
  //         name: 'jeff'
  //       }
  //     }
  //   }
  // }
})
