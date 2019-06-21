import { gql } from 'apollo-server-express'
import { GraphQLModule } from '@graphql-modules/core'

export const AuthModule = new GraphQLModule({
  typeDefs: gql`
    type Person {
      name: String,
      age: Int
    }

    type Query {
      hello: String,
      me: Person
    }

    type Mutation {
      login (): void,
      logout (): void
    }
  `
})
