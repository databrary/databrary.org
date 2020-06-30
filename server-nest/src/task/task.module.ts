import { Module } from '@nestjs/common'
import { TaskProcessor } from './task.processor'
import { QueueModule } from '../queue/queue.module'
import { MinioModule } from '../minio/minio.module'
import { UserModule } from '../users/user.module'
import { FileModule } from '../file/file.module'
import { AssetModule } from '../asset/asset.module'

@Module({
  imports: [QueueModule, UserModule, FileModule, AssetModule, MinioModule],
  providers: [TaskProcessor],
  exports: [TaskProcessor]
})
export class TaskModule {}
