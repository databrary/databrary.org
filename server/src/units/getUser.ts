import _ from 'lodash'
import client from '../graphqlClient'
import { gql } from 'apollo-server-express'
import { logger } from '@shared'

const query = gql`
  query getUser($authServerId: String!) {
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
export async function getUser (authServerId: string) {
  logger.debug(`Getting User ID for ${authServerId}`)
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
