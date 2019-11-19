import crypto from 'crypto'
import { Client, CopyConditions } from 'minio'
import _ from 'lodash'

import {
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY
} from '../config'

const minioClient = new Client({
  endPoint: 'localhost',
  port: 9000,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
  useSSL: false // Default is true.
})

export default async function hashFile (input: object) {
  const hashSha256 = crypto.createHash('sha256')
  const hashMd5 = crypto.createHash('md5')
  const hashSha1 = crypto.createHash('sha1') // todo check this
  let size = 0
  minioClient.getObject('uploads', input['key'], function (err, dataStream) {
    if (err) {
      return console.log(err)
    }
    dataStream.on('data', function (chunk) {
      size += chunk.length
      hashSha256.update(chunk)
      hashMd5.update(chunk)
    })
    dataStream.on('end', function () {
      const sha256Digest = hashSha256.digest().toString('hex')
      const shaMd5Digest = hashMd5.digest().toString('hex')

      const conds = new CopyConditions()
      conds.setMatchETag(input['eTag'])
      if (size !== input['size']) {
        console.log('Size mismatch')
      }

      // Move original /upload/file to /cas/sha256(file)
      minioClient.copyObject('cas', sha256Digest, `/uploads/${input['key']}`, conds, function (e, data) {
        if (e) {
          return console.log(e)
        }
        minioClient.removeObject('uploads', input['key'], function (err) {
          if (err) {
            return console.log('Unable to remove object', err)
          }
        })
      })
    })
    dataStream.on('error', function (err) {
      console.log(err)
    })
  })
  return 'answer'
}

// async function main () {
//   await hashFile({
//     'key': 'dims.jpg',
//     'size': 244692,
//     'eTag': 'aa857d295fd17dc816a13478f8e25f50-1',
//     'contentType': 'image/jpeg',
//     'userMetadata': {
//       'content-type': 'image/jpeg'
//     },
//     'versionId': '1',
//     'sequencer': '15D606E318B9C2CC'
//   })
// }

// // tslint:disable-next-line: no-floating-promises
// main()
