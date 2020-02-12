import _ from 'lodash'
import crypto from 'crypto'
import { Client } from 'minio'
import { adminQuery } from '../graphqlClient'

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

export interface IFileInfo {
  size: number
  md5: string
  sha1: string
  sha256: string
  location?: string
}

export function hashAndSizeMinio (client: Client, decodedKey: string): Promise<IFileInfo> {
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

export async function canAccessAsset (id: number) {
  const response = await adminQuery(
    `${process.cwd()}/../gql/checkPermissionOfAsset.gql`,
    {
      id
    })
  return !_.isEmpty(response)
}
