import { adminMutate } from '../graphqlClient'
import { gql } from 'apollo-server-express'

export async function registerUser (authServerId: string, emailPrimary: string, firstName: string, lastName: string, emails: string[], middleName: string = '') {
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
      urls
    }
  )
  if (!response) {
    return null
  }
  return response.data.insert_users.returning[0]
}
