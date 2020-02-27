import _ from 'lodash'
import crypto from 'crypto'
import { Client, CopyConditions } from 'minio'
import { adminQuery } from '../graphqlClient'
import { logger } from '@shared'

let minioClient = new Client({
  endPoint: 'localhost',
  port: 9000,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  useSSL: false // Default is true.
})

export interface IFileInfo {
  size: number
  md5: string
  sha1: string
  sha256: string
  location?: string
}

export function uuid () {
  let s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('')
}

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
