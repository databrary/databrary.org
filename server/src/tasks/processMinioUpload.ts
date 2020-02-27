import _ from 'lodash'
import { adminQuery, adminMutate } from '../graphqlClient'
import { logger } from '@shared'
import { copyObject, IFileInfo, hashAndSizeMinio, fileExists } from '@utils'

export async function getAsset (id: number) {
  const response = await adminQuery(
    `${process.cwd()}/../gql/getAssetById.gql`,
    {
      id
    })
  if (_.isEmpty(response)) {
    return null
  }
  return response.data.assets[0]
}

async function getFileId (input: any) {
  // Converts the key--the filename as a string--to an integer
  // representing the row id in the File table
  return _.toInteger(input.key)
}

async function getFileById (id: number) {
  let response = await adminQuery(
    `${process.cwd()}/../gql/getFile.gql`,
    {
      id
    }
  )
  const file = response.returning[0]
  return
}

export default async function processMinioUpload (input: any) {
  logger.debug(`Processing Minio upload for file ${input.key}`)

  const fileId = await getFileId(input)
  const file: any = await getFileById(fileId)
  const parentAsset = await getAsset(file.asset_id)
  if (parentAsset === null) {
    // No permission
    return
  }

  // Get file info
  const fileInfo: IFileInfo = await hashAndSizeMinio('uploads', _.toString(fileId))
  if (fileInfo.size !== input.size) {
    logger.error('Size mismatch') // TODO We need an error here
  }

  fileInfo.location = 's3://minio-1.nyu.edu/cas'

  const fileExistsInCas = await fileExists('cas', fileInfo.sha256)

  let fileobjectId: number
  let response: any

  if (!fileExistsInCas) {

    const fileCopied = await copyObject('cas', fileInfo.sha256, `/uploads/${input['key']}`, input['eTag'])
    if (fileCopied) {
      // Create a fileobjects reference
      response = await adminMutate(
        `${process.cwd()}/../gql/insertFileObjectOnUpload.gql`, // TODO brittle for a number of reasons
        fileInfo
      )
      fileobjectId = response.returning[0].id
    }
  } else {
    response = await adminQuery(
      `${process.cwd()}/../gql/getFileObjectId.gql`, { // TODO brittle for a number of reasons
        sha256: fileInfo.sha256
      }
    )
    fileobjectId = response[0].id
  }

  if (fileobjectId != null) {
    logger.info(`File Object ID ${fileobjectId}`)

    const uploadedDatetime = new Date().toISOString()

    const responseUpdateFileObject = await adminMutate(
      `${process.cwd()}/../gql/updateFile.gql`, {
        fileId: fileId,
        fileobjectId: fileobjectId,
        uploadedDatetime: uploadedDatetime
      }
    )

    logger.info(`File ${fileId} processed`)
  }

  // // Remove the original file
  // await minioClient.removeObject('uploads', decodedKey)

}
