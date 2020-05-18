
import { DynamicModule } from '@nestjs/common'
import { RedisModule, RedisModuleOptions } from 'nestjs-redis'
import { ConfigService } from '@nestjs/config'

export const Redis: DynamicModule = RedisModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService): RedisModuleOptions => {
    return {
      host: config.get('REDIS_HOST'),
      port: config.get('REDIS_PORT')
    };
  },
});