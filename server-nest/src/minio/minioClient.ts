import { ConfigService } from '@nestjs/config'
import { Client } from 'minio'
import { toInteger } from 'lodash'

export const MinioClient = {
  provide: 'MINIO_CLIENT',
  useFactory: (config: ConfigService) => {
    return new Client({
      endPoint: config.get('MINIO_ENDPOINT'),
      port: toInteger(config.get('MINIO_PORT')),
      accessKey: config.get('MINIO_ACCESS_KEY'),
      secretKey: config.get('MINIO_SECRET_KEY'),
      useSSL: false // Default is true.
    })
  },
  inject: [ConfigService]
}
