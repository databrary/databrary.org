import { adminMutate } from '../graphqlClient'

export async function removeFile (fileId: number) {
  const response = await adminMutate(
    `${process.cwd()}/../gql/removeFile.gql`, {
      fileId: fileId
    }
  )
  return response.returning[0].id
}
