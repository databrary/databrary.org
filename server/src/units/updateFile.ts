import { adminMutate } from '../graphqlClient'

export async function updateFile (fileId: number, fileobjectId: number, uploadedDatetime: any) {
  const response = await adminMutate(
    `${process.cwd()}/../gql/updateFile.gql`, {
      fileId: fileId,
      fileobjectId: fileobjectId,
      uploadedDatetime: uploadedDatetime
    }
  )
  return response.returning[0]
}
