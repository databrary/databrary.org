import { Module } from '@nestjs/common';
import { MinioController } from './minio.controller'
import { MinioService } from './minio.service';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { toInteger } from 'lodash'
import { UserModule } from 'src/users/user.module'
import { FileModule } from 'src/file/file.module'

const minioClient = {
    provide: 'MINIO_CLIENT',
    useFactory: (config: ConfigService) => {
        return new Client({
            endPoint: config.get('MINIO_ENDPOINT'),
            port: toInteger(config.get('MINIO_PORT')),
            accessKey: config.get('MINIO_ACCESS_KEY'),
            secretKey: config.get('MINIO_SECRET_KEY'),
            useSSL: false // Default is true.
          }
        )
    },
    inject: [ConfigService]
}

@Module({
    imports: [UserModule, FileModule],
    controllers: [MinioController],
    providers: [MinioService, minioClient]
})
export class MinioModule {}
