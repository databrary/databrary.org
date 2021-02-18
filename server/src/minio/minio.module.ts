import { Module } from '@nestjs/common'
import { MinioController } from './minio.controller'
import { MinioService } from './minio.service'
import { UserModule } from '../users/user.module'
import { FileModule } from '../file/file.module'
import { QueueModule } from '../queue/queue.module'
import { MinioClient } from './minioClient'

@Module({
  imports: [UserModule, FileModule, QueueModule],
  controllers: [MinioController],
  providers: [MinioService, MinioClient],
  exports: [MinioService]
})
export class MinioModule {}
