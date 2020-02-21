import _ from 'lodash'
import crypto from 'crypto'
import { Client, CopyConditions } from 'minio'
import { adminMutate ,adminQuery } from '../graphqlClient'
import { logger } from '@shared'
import { IFileInfo } from '@utils'

let minioClient = new Client({
  endPoint: 'localhost',
  port: 9000,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  useSSL: false // Default is true.
})

export function hashAndSizeMinio (bucket: string, decodedKey: string): Promise<IFileInfo> {
  return new Promise((resolve, reject) => {
    const hashSha256 = crypto.createHash('sha256')
    const hashMd5 = crypto.createHash('md5')
    const hashSha1 = crypto.createHash('sha1') // todo check this
    let size = 0

    minioClient.getObject(bucket, decodedKey, function (err, dataStream) {
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

export async function canAccessAsset (id: number) {
  const response = await adminQuery(
        `${process.cwd()}/../gql/checkPermissionOfAsset.gql`,
    {
      id
    })
  return !_.isEmpty(response)
}

export async function fileExists (bucket: string, sha256: string) {
  try {
    await minioClient.statObject(bucket, sha256)
  } catch (err) {
    logger.error(`fileExists error: ${err}`)
    return false
  }
  return true
}

export async function bucketExists (bucket: string) {
  try {
    await minioClient.bucketExists(bucket)
  } catch (err) {
    logger.error(`bucketExists error: ${err}`)
    return false
  }
  return true
}

export async function copyObject (destinationBucket: string, sha256: string, sourceFile: string, eTag: string) {
    // Copy the file from the upoloads folder
  try {
    const conds = new CopyConditions()
    conds.setMatchETag(eTag)
    await minioClient.copyObject(destinationBucket, sha256, sourceFile, conds)
  } catch (err) {
    logger.error(`copyObject error: ${err}`)
    return false
  }
  return true
}

export function getMinioClient () {
  return minioClient
}

export async function processAvatarUpload (input: object, authServerId: any) {
    // TODO process here the avatar upload
    // const fileId = _.toInteger(input['key'])
    // hash and size the file
  const fileInfo: IFileInfo = await hashAndSizeMinio('uploads', input['key'])
  if (fileInfo['size'] !== input['size']) {
    logger.error('Size mismatch') // TODO We need an error here
  }
    // check if exist
  fileInfo.location = 's3://minio-1.nyu.edu/cas'

  const fileExistsInCas = await fileExists('cas', fileInfo.sha256)

  let fileobjectId
  let response

  if (!fileExistsInCas) {
    const fileCopied = await copyObject('cas', fileInfo.sha256, `/avatars/${input['key']}`, input['eTag'])
    if (fileCopied) {
            // process original and small format of the picture and rename
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
    response = await adminMutate(
            `${process.cwd()}/../gql/updateUserAvatar.gql`,
      {
        authServerId: authServerId,
        fileobjectId: fileobjectId
      }
        )

    logger.info(`User ${authServerId} processed`)
  }
}
