import _ from 'lodash'
import { adminQuery } from '../graphqlClient'

export async function getUserByAuthId (authServerId: string) {
  const response = await adminQuery(
    `${process.cwd()}/../gql/getUserByAuthId.gql`, {
      authServerId: authServerId
    }
  )
  if (_.isEmpty(response)) {
    return null
  }
  return response[0]
}
