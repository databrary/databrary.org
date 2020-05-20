
import { DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisModule, RedisModuleOptions } from 'nestjs-redis';

export const Redis: DynamicModule = RedisModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService): RedisModuleOptions => {
    return {
      host: config.get('REDIS_HOST'),
      port: config.get('REDIS_PORT')
    };
  },
});