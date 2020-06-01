import * as crypto from 'crypto'
import { createReadStream } from 'fs'

export class FileObjectDTO {
  md5: string
  size: number
  sha1: string
  sha256: string
  location: string

  constructor (fileObject: Partial<FileObjectDTO>) {
    Object.assign(this, fileObject)
  }

  static async hashAndSizeFile (filePath: string, bucket: string): Promise<FileObjectDTO> {
    return await new Promise((resolve, reject) => {
      const hashSha256 = crypto.createHash('sha256')
      const hashMd5 = crypto.createHash('md5')
      const hashSha1 = crypto.createHash('sha1') // todo check this
      let size = 0

      const dataStream = createReadStream(filePath)
      dataStream.on('data', function (data) {
        size += data.length
        hashSha256.update(data)
        hashMd5.update(data)
        hashSha1.update(data)
      })

      // making digest
      dataStream.on('end', function () {
        const md5 = hashMd5.digest().toString('hex')
        const sha1 = hashSha1.digest().toString('hex')
        const sha256 = hashSha256.digest().toString('hex')
        resolve(new FileObjectDTO({
          size,
          md5,
          sha1,
          sha256,
          location: `s3://minio-1.nyu.edu/${bucket}`
        }))
      })

      dataStream.on('error', function (err) {
        reject(err)
      })
    })
  }
}
