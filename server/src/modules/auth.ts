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
      register(email: String!, password: String!): String,
      login (email: String!, password: String!): String,
      logout (): void
    }
  `
})
