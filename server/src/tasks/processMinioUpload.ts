import _ from 'lodash'
import { adminQuery, adminMutate } from '../graphqlClient'
import { logger } from '@shared'
import { copyObject, IFileInfo, canAccessAsset, hashAndSizeMinio, fileExists } from '@utils'

export default async function processMinioUpload (input: object) {
  logger.debug(`Processing Minio upload for file ${JSON.stringify(input)}`)
  const fileId = _.toInteger(input['key'])
  logger.debug(`Input Key ${input['key']} and fieldId ${fileId}`)

  // Get the file object based on the key
  let response = await adminQuery(
    `${process.cwd()}/../gql/getFile.gql`,
    {
      id: fileId
    }
  )
  const file = response[0]

  const hasPermission = await canAccessAsset(file.assetId)
  if (!hasPermission) {
    return
  }

  // Get file info
  const fileInfo: IFileInfo = await hashAndSizeMinio(input['bucketName'], input['key'])
  if (fileInfo['size'] !== input['size']) {
    logger.error('Size mismatch') // TODO We need an error here
  }

  fileInfo.location = 's3://minio-1.nyu.edu/cas'

  const fileExistsInCas = await fileExists('cas', fileInfo.sha256)

  let fileobjectId

  if (!fileExistsInCas) {

    const fileCopied = await copyObject('cas', fileInfo.sha256, `/${input['bucketName']}/${input['key']}`, input['eTag'])
    if (fileCopied) {
      // Create a fileobjects reference
      response = await adminMutate(
        `${process.cwd()}/../gql/insertFileObjectOnUpload.gql`, // TODO brittle for a number of reasons
        fileInfo
      )
      fileobjectId = response.returning[0].id
    }
  } else {
    response = await adminMutate(
      `${process.cwd()}/../gql/getFileObjectId.gql`, { // TODO brittle for a number of reasons
        sha256: fileInfo.sha256
      }
    )
    fileobjectId = response[0].id
  }

  if (fileobjectId != null) {
    logger.info(`File Object ID ${fileobjectId}`)

    const uploadedDatetime = new Date().toISOString()

    response = await adminMutate(
      `${process.cwd()}/../gql/updateFile.gql`, {
        fileId: fileId,
        fileobjectId: fileobjectId,
        uploadedDatetime: uploadedDatetime
      }
    )

    logger.info(`File ${fileId} processed`)
  }
}
