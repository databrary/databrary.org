import client from '../graphqlClient'
import { gql } from 'apollo-server-express'
import { logger } from '@shared'

const mutation = gql`
  mutation registerUser($authServerId: String!, $emailPrimary: String!, $emails: jsonb!) {
    insert_users(objects: {
      auth_server_id: $authServerId,
      email_primary: $emailPrimary,
      emails: $emails
    }) {
      returning {
        id
        auth_server_id
        email_primary
        display_full_name
        emails
      }
    }
  }
`
export async function registerUser (authServerId: string, emailPrimary: string, emails: string[]) {
  const response = await client.mutate({
    mutation,
    variables: {
      authServerId,
      emailPrimary,
      emails
    }
  })
  if (!response) {
    return null
  }
  return response.data.insert_users.returning[0]
}
