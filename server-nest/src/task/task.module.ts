import { Module } from '@nestjs/common';
import { TaskProcessor } from './task.processor'
import { QueueModule } from 'src/queue/queue.module'
import { MinioModule } from 'src/minio/minio.module'
import { UserModule } from 'src/users/user.module'
import { FileModule } from 'src/file/file.module'

@Module({
    imports: [QueueModule, UserModule, FileModule, MinioModule],
    providers: [TaskProcessor],
    exports: [TaskProcessor]
})
export class TaskModule {}
