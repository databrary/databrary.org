import client from '../graphqlClient'
import { gql } from 'apollo-server-express'
import { logger } from '@shared'

const mutation = gql`
  mutation registerUser($authServerId: String!, $emailPrimary: String!, $firstName: String, $lastName: String, $middleName: String,$displayFullName: String, $citationName: String) {
    insert_users(objects: {
      auth_server_id: $authServerId,
      email_primary: $emailPrimary,
      first_name: $firstName,
      last_name: $lastName,
      middle_name: $middleName,
      display_full_name: $displayFullName,
      citation_name: $citationName
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
export async function registerUser (authServerId: string, emailPrimary: string, firstName: string, lastName: string, middleName: string = '') {
  const displayFullName = `${firstName} ${lastName}`
  const citationName = `${lastName}, ${firstName}`
  logger.debug('Registering a user')
  const response = await client.mutate({
    mutation,
    variables: {
      authServerId,
      emailPrimary,
      firstName,
      lastName,
      middleName,
      displayFullName,
      citationName
    }
  })
  if (!response) {
    return null
  }
  return response.data.insert_users.returning[0]
}
