import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as redis from 'redis'
import * as redisStore from 'connect-redis'

import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Get env variables
  const port = configService.get('SERVER_PORT');
  const redis_host = configService.get('REDIS_HOST');
  const redis_port = configService.get('REDIS_PORT');
  const redis_ttl = configService.get('REDIS_TTL');
  const session_name = configService.get('SESSION_NAME');
  const session_secret = configService.get('SESSION_SECRET');

  const RedisStore = redisStore(session)

  app.use(session({
    name: session_name,
    secret: session_secret,
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({
      host: redis_host,
      port: redis_port,
      client: redis.createClient(),
      ttl: redis_ttl
    }),
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000 // TODO come up with a reasonable number here; this is a month in ms
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  await app.listen(port);
}
bootstrap();
