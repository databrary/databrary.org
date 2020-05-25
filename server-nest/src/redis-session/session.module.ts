import { ConfigService } from '@nestjs/config'

import * as ConnectRedis from 'connect-redis'
import { RedisService } from 'nestjs-redis'
import { Redis } from '../redis/redis.module'

import * as session from 'express-session'
import { NestSessionOptions, SessionModule } from 'nestjs-session'

const RedisStore = ConnectRedis(session)

export const Session = SessionModule.forRootAsync({
  imports: [Redis],
  inject: [RedisService, ConfigService],
  useFactory: (
    redisService: RedisService,
    config: ConfigService
  ): NestSessionOptions => {
    const redisClient = redisService.getClient()
    const store = new RedisStore({ client: redisClient as any })
    return {
      session: {
        store,
        secret: config.get('SESSION_SECRET')
      }
    }
  }
})
