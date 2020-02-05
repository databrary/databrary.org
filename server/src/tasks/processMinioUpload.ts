import crypto from 'crypto'
import { Client, CopyConditions } from 'minio'
import _ from 'lodash'
import '../config'
import { adminQuery, adminMutate } from '../graphqlClient'
import { logger } from '@shared'

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: Number(process.env.MINIO_PORT),
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  useSSL: false // Default is true.
})

interface FileInfo {
  size: number
  md5: string
  sha1: string
  sha256: string
  location?: string
}

function hashAndSizeMinio (client: Client, decodedKey: string): Promise<FileInfo> {
  return new Promise((resolve, reject) => {
    const hashSha256 = crypto.createHash('sha256')
    const hashMd5 = crypto.createHash('md5')
    const hashSha1 = crypto.createHash('sha1') // todo check this
    let size = 0

    client.getObject('uploads', decodedKey, function (err, dataStream) {
      if (err) { reject(err) }

      dataStream.on('data', function (chunk) {
        size += chunk.length
        hashMd5.update(chunk)
        hashSha1.update(chunk)
        hashSha256.update(chunk)
      })

      dataStream.on('end', function () {
        const md5 = hashMd5.digest().toString('hex')
        const sha1 = hashSha1.digest().toString('hex')
        const sha256 = hashSha256.digest().toString('hex')
        resolve({
          size,
          md5,
          sha1,
          sha256
        })
      })

      dataStream.on('error', function (err) {
        reject(err)
      })
    })
  })
}

async function canAccessAsset (id: number) {
  const response = await adminQuery(
    `${process.cwd()}/../gql/checkPermissionOfAsset.gql`,
    {
      id
    }
  )
  return !_.isEmpty(response)
}

export default async function processMinioUpload (input: object) {
  logger.debug(`Processing Minio upload for file ${input['key']}`)
  // Get the file object based on the key
  const response = await adminQuery(
    `${process.cwd()}/../gql/getFile.gql`,
    {
      id: _.toInteger(input['key'])
    }
  )
  const file = response[0]

  const hasPermission = await canAccessAsset(file.asset_id)
  if (!hasPermission) {
    return
  }

  const eTag = input['eTag']

  // Get file info
  const fileInfo: FileInfo = await hashAndSizeMinio(minioClient, input['key'])
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

  if (!fileExistsInCas) {
    // Copy the file from the upoloads folder
    const conds = new CopyConditions()
    conds.setMatchETag(eTag)
    await minioClient.copyObject('cas', fileInfo.sha256, `/uploads/${input['key']}`, conds)

    // Create a fileobjects reference
    const response = await adminMutate(
      `${process.cwd()}/../gql/insertFileObjectOnUpload.gql`, // TODO brittle for a number of reasons
      fileInfo
    )
    const fileobjectId = response.returning[0].id

    // TODO Update file with fileobject reference
    const responseUpdateFileObject = await adminMutate(
      `${process.cwd()}/../gql/updateFile.gql`,
      fileInfo
    )
  }

  // // Remove the original file
  // await minioClient.removeObject('uploads', decodedKey)

}
