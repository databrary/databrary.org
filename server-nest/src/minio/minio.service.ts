import { Injectable, Inject } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import { Client } from 'minio'
import { Queue } from 'bull';

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

  async addJob(object: Object) {
    await this.queue.add('upload', object)
  }
}
