import _ from 'lodash'
import { adminQuery } from '../graphqlClient'

export async function canAccessAsset (id: number) {
  const response = await adminQuery(
    `${process.cwd()}/../gql/checkPermissionOfAsset.gql`, {
      id
    }
  )

  return !_.isEmpty(response)
}
