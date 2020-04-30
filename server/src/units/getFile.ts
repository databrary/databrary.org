import { adminQuery } from '../graphqlClient'

export async function getFile (fileId: number) {
  const response = await adminQuery(
    `${process.cwd()}/../gql/getFile.gql`,
    {
      id: fileId
    }
  )
  return response[0]
}
