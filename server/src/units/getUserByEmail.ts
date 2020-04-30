import _ from 'lodash'
import { adminQuery } from '../graphqlClient'

export async function getUserByEmail (email: string) {
  const response = await adminQuery(
    `${process.cwd()}/../gql/getUserByEmail.gql`, {
      email: email
    }
  )
  if (_.isEmpty(response)) {
    return null
  }
  return response[0]
}
