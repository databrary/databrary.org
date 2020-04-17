import _ from 'lodash'
import client from '../graphqlClient'
import { gql } from 'apollo-server-express'

const query = gql`
  query getUserByEmail($email: String!) {
    users(
      where: {
        emailPrimary: {
          _eq: $email
        }
      }
    ) {
      id
      authServerId
      emailPrimary
      displayFullName
    }
  }
`
export async function getUserByEmail (email: string) {
  const response = await client.query({
    query: query,
    variables: {
      email
    }
  })
  if (_.isEmpty(response.data.users)) {
    return null
  }
  return response.data.users[0]
}
