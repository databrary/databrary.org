import client from '../graphqlClient'
import { gql } from 'apollo-server-express'
import { logger } from '@shared'

const mutation = gql`
  mutation registerUser($authServerId: String!, $emailPrimary: String!) {
    insert_users(objects: {
      auth_server_id: $authServerId,
      email_primary: $emailPrimary,
    }) {
      returning {
        id
        auth_server_id
        email_primary
        display_full_name
      }
    }
  }
`
export async function registerUser (authServerId: string, emailPrimary: string) {
  const response = await client.mutate({
    mutation,
    variables: {
      authServerId,
      emailPrimary
    }
  })
  if (!response) {
    return null
  }
  return response.data.insert_users.returning[0]
}
