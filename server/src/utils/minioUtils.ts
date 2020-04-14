import _ from 'lodash'
import crypto from 'crypto'
import { Client, CopyConditions } from 'minio'
import { adminMutate ,adminQuery } from '../graphqlClient'
import { logger } from '@shared'
import { IFileInfo } from '@utils'

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT,
  port: _.toInteger(process.env.MINIO_PORT),
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
  return new Promise((resolve, reject) => {
    minioClient.statObject(bucket, sha256, (err, stat) => {
      if (err) {
        logger.info(`File Not Found in ${bucket}: ${err}`)
        resolve(false)
      }
      resolve(true)
    })
  })
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

export async function getPresignedGetObject(bucket: string, sha256: string) {
  return new Promise((resolve, reject) => {
    minioClient.presignedGetObject(bucket, sha256, (err, url) => {
      if (err) {
        reject(err)
      }
      resolve(url)
    })
  })
}

export function getMinioClient () {
  return minioClient
}