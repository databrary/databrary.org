import { BullModule } from '@nestjs/bull'
import { ConfigService } from '@nestjs/config'

export const QueueModule = BullModule.registerQueueAsync({
    name: 'QUEUE',
    useFactory: async ( config: ConfigService) => ({
        redis: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT')
        }
    }),
    inject: [ConfigService]
})
