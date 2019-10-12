import client from '../graphqlClient'
import { gql } from 'apollo-server-express'
import _ from 'lodash'

const query = gql`
  query MyQuery($authServerId: String!) {
    users(
      where: {
        auth_server_id: {
          _eq: $authServerId
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
export default async function getUser (authServerId: string) {
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
