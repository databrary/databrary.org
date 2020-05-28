import { Injectable, Inject } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Client, CopyConditions } from 'minio'
import { Queue } from 'bull'
import { createHash } from 'crypto'
import { FileDTO } from 'src/dtos/file.dto'
import { FileObjectDTO } from 'src/dtos/fileobject.dto'

@Injectable()
export class MinioService {

  constructor (
    @Inject('MINIO_CLIENT') private readonly minioClient: Client,
    @InjectQueue('QUEUE') private queue: Queue
  ) { }

  get client (): Client {
    return this.minioClient
  }

  async bucketExists (bucket: string): Promise<boolean> {
    try {
      return await this.client.bucketExists(bucket)
    } catch (error) {
      console.error(error)
    }

    return false
  }

  async fileExists (bucket: string, name: string): Promise<boolean> {
    try {
      const { etag } = await this.client.statObject(bucket, name)
      return etag ? true : false
    } catch (error) {}

    return false
  }

  async copyObject (bucket: string, name: string, path: string, eTag: string) {
    try {
      const conds = new CopyConditions()
      conds.setMatchETag(eTag)

      await this.client.copyObject(bucket, name, path, conds)

      return true
    } catch (error) {
      console.error(error)
    }
    return false
  }

  // async uploadObject (file: FileDTO): Promise<boolean> {
  //   return new Promise((resolve, reject) => {
  //     this.client.fPutObject(file.bucket, file.sha256, file.path, {}, (err, eTag) => {
  //       if (err) {
  //         reject(false)
  //       }
  //       resolve(true)
  //     })
  //   })
  // }

  async hashAndSizeMinio (bucket: string, name: string): Promise<FileObjectDTO> {
    return new Promise((resolve, reject) => {
      const hashSha256 = createHash('sha256')
      const hashMd5 = createHash('md5')
      const hashSha1 = createHash('sha1') // todo check this
      let size = 0
  
      this.client.getObject(bucket, name, function (err, dataStream) {
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
          resolve(new FileObjectDTO ({
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
    })
  }

  async addJob(name: string, object: Object) {
    await this.queue.add(name, object)
  }
}
