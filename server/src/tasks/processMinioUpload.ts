import _ from 'lodash'
import { Client, CopyConditions } from 'minio'
import { adminQuery, adminMutate } from '../graphqlClient'
import { logger } from '@shared'
import { IFileInfo, canAccessAsset, hashAndSizeMinio } from '@utils'

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  useSSL: false // Default is true.
})

export default async function processMinioUpload (input: object) {

  logger.debug(`Processing Minio upload for file ${input['key']}`)
  const fileId = _.toInteger(input['key'])

  // Get the file object based on the key
  let response = await adminQuery(
    `${process.cwd()}/../gql/getFile.gql`,
    {
      id: fileId
    }
  )
  const file = response[0]

  const hasPermission = await canAccessAsset(file.asset_id)
  if (!hasPermission) {
    return
  }

  const eTag = input['eTag']

  // Get file info
  const fileInfo: IFileInfo = await hashAndSizeMinio(minioClient, input['key'])
  if (fileInfo['size'] !== input['size']) {
    logger.error('Size mismatch') // TODO We need an error here
  }

  fileInfo.location = 's3://minio-1.nyu.edu/cas'

  let fileExistsInCas: boolean
  try {
    await minioClient.statObject('cas', fileInfo.sha256)
    fileExistsInCas = true
  } catch (err) {
    fileExistsInCas = false
  }

  let fileobjectId

  if (!fileExistsInCas) {
    // Copy the file from the upoloads folder
    const conds = new CopyConditions()
    conds.setMatchETag(eTag)
    await minioClient.copyObject('cas', fileInfo.sha256, `/uploads/${input['key']}`, conds)
    // Create a fileobjects reference
    response = await adminMutate(
      `${process.cwd()}/../gql/insertFileObjectOnUpload.gql`, // TODO brittle for a number of reasons
      fileInfo
    )
    fileobjectId = response.returning[0].id
  } else {
    response = await adminMutate(
      `${process.cwd()}/../gql/getFileObjectId.gql`, { // TODO brittle for a number of reasons
        sha256: fileInfo.sha256
      }
    )
    fileobjectId = response[0].id
  }

  if (fileobjectId != null) {
    console.log(`File Object ID ${fileobjectId}`)

    const uploadedDatetime = new Date().toISOString()

    const responseUpdateFileObject = await adminMutate(
      `${process.cwd()}/../gql/updateFile.gql`, {
        fileId: fileId,
        fileobjectId: fileobjectId,
        uploadedDatetime: uploadedDatetime
      }
    )

    console.log(`File ${fileId} processed`)
  }

  // // Remove the original file
  // await minioClient.removeObject('uploads', decodedKey)

}
