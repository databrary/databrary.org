import client from '../graphqlClient'
import { gql } from 'apollo-server-express'
import { logger } from '@shared'

const mutation = gql`
  mutation registerUser($authServerId: String!,
                        $emailPrimary: String!,
                        $firstName: String,
                        $lastName: String,
                        $middleName: String,
                        $displayFullName: String,
                        $emails: jsonb,
                        $urls: jsonb) {
    insert_users(objects: {
      authServerId: $authServerId,
      emailPrimary: $emailPrimary,
      givenName: $firstName,
      familyName: $lastName,
      additionalName: $middleName,
      displayFullName: $displayFullName,
      emails: $emails,
      urls: $urls
    }) {
      returning {
        id
        authServerId
        emailPrimary
        displayFullName
        useGravatar
      }
    }
  }
`
export async function registerUser (authServerId: string, emailPrimary: string, firstName: string, lastName: string, emails: string[], middleName: string = '') {
  const displayFullName = `${firstName} ${lastName}`
  const urls = []
  const response = await client.mutate({
    mutation,
    variables: {
      authServerId,
      emailPrimary,
      firstName,
      lastName,
      middleName,
      displayFullName,
      emails,
      urls
    }
  })
  if (!response) {
    return null
  }
  return response.data.insert_users.returning[0]
}
