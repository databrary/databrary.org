import { Injectable, Inject } from '@nestjs/common'
import { Client } from 'minio'

@Injectable()
export class MinioService {
  private readonly minioClient: Client

  constructor (
  @Inject('MINIO_CLIENT') client: Client
  ) {
    this.minioClient = client
  }

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
}
