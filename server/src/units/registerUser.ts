import { adminMutate } from '../graphqlClient'
import { gql } from 'apollo-server-express'

export async function registerUser (authServerId: string, emailPrimary: string, firstName: string, lastName: string, emails: string[], gravatar: Object,middleName: string = '') {
  const displayFullName = `${firstName} ${lastName}`
  const urls = []
  const response = await adminMutate(
    `${process.cwd()}/../gql/registerUser.gql`, {
      authServerId,
      emailPrimary,
      firstName,
      lastName,
      middleName,
      displayFullName,
      emails,
      urls,
      gravatar
    }
  )
  if (!response) {
    return null
  }
  return response.data.insert_users.returning[0]
}
