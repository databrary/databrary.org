import { Injectable, Inject } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Client, CopyConditions } from 'minio'
import { Queue } from 'bull'
import { createHash } from 'crypto'
import { FileObjectDTO } from '../dtos/fileobject.dto'
import { Buckets } from '../common/types'
import { IRecordUserMetadata } from '../common/IRecordUserMetadata'

@Injectable()
export class MinioService {
  constructor (
    @Inject('MINIO_CLIENT') private readonly minioClient: Client,
    @InjectQueue('QUEUE') private readonly queue: Queue
  ) {}

  get client (): Client {
    return this.minioClient
  }

  async bucketExists (bucket: Buckets): Promise<boolean> {
    try {
      return await this.client.bucketExists(bucket)
    } catch (error) {
      console.error(error)
    }

    return false
  }

  async fileExists (bucket: Buckets, name: string): Promise<boolean> {
    try {
      const { etag } = await this.client.statObject(bucket, name)
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      return !!etag
    } catch (error) {}

    return false
  }

  async copyObject (bucket: Buckets, name: string, path: string, eTag: string) {
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

  async getObject (
    bucket: Buckets,
    name: string,
    path: string
  ): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      this.client.fGetObject(bucket, name, path, (err) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        if (err != null) reject(false)
        resolve(true)
      })
    })
  }

  async uploadObject (
    bucket: Buckets,
    name: string,
    path: string,
    metaData: IRecordUserMetadata
  ): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      this.client.fPutObject(bucket, name, path, metaData, (err, eTag) => {
        if (err != null) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject(false)
        }
        resolve(true)
      })
    })
  }

  async hashAndSizeMinio (
    bucket: Buckets,
    name: string
  ): Promise<FileObjectDTO> {
    return await new Promise((resolve, reject) => {
      const hashSha256 = createHash('sha256')
      const hashMd5 = createHash('md5')
      const hashSha1 = createHash('sha1') // todo check this
      let size = 0

      this.client.getObject(bucket, name, function (err, dataStream) {
        if (err != null) {
          reject(err)
        }
        dataStream.on('data', function (chunk) {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          size += chunk.length
          hashMd5.update(chunk)
          hashSha1.update(chunk)
          hashSha256.update(chunk)
        })

        dataStream.on('end', function () {
          const md5 = hashMd5.digest().toString('hex')
          const sha1 = hashSha1.digest().toString('hex')
          const sha256 = hashSha256.digest().toString('hex')
          resolve(
            new FileObjectDTO({
              size,
              md5,
              sha1,
              sha256,
              location: `s3://minio-1.nyu.edu/${bucket}`
            })
          )
        })

        dataStream.on('error', function (err) {
          reject(err)
        })
      })
    })
  }

  async addJob (bucket: Buckets, object: Record<string, any>) {
    await this.queue.add(bucket, object)
  }
}
