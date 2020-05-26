import { Module } from '@nestjs/common';
import { TaskProcessor } from './task.processor'
import { QueueModule } from 'src/queue/queue.module'

@Module({
    imports: [QueueModule],
    providers: [TaskProcessor],
    exports: [TaskProcessor]
})
export class TaskModule {}
