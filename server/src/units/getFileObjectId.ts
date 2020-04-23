import { adminQuery } from '../graphqlClient'

// Get file object id from sha256
export async function getFileObjectId (sha256: string) {
  const response = await adminQuery(
      `${process.cwd()}/../gql/getFileObjectId.gql`, { // TODO brittle for a number of reasons
        sha256: sha256
      }
  )
  return response[0].id
}
