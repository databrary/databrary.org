import { adminMutate } from '../graphqlClient'

export async function insertFile (fileName: string, dbId: number, assetId: number, fileFormat: string) {
  const response = await adminMutate(
    `${process.cwd()}/../gql/insertFile.gql`, {
      name: decodeURIComponent(fileName),
      uploadedById: dbId,
      assetId: assetId,
      fileFormatId: fileFormat
    }
  )
  // Get the unique id of the upload object and make that the filename
  return response.returning[0].id
}
