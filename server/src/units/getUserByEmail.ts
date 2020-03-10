import _ from 'lodash'
import client from '../graphqlClient'
import { gql } from 'apollo-server-express'

const query = gql`
  query getUserByEmail($email: String!) {
    users(
      where: {
        email_primary: {
          _eq: $email
        }
      }
    ) {
      id
      auth_server_id
      email_primary
      display_full_name
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
