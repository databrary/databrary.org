import _ from 'lodash'
import client from '../graphqlClient'
import { gql } from 'apollo-server-express'

const query = gql`
  query getUserByAuthId($authServerId: String!) {
    users(
      where: {
        authServerId: {
          _eq: $authServerId
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
export async function getUserByAuthId (authServerId: string) {
  const response = await client.query({
    query: query,
    variables: {
      authServerId
    }
  })
  if (_.isEmpty(response.data.users)) {
    return null
  }
  return response.data.users[0]
}
