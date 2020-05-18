import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

const proxy = require('express-http-proxy')

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  // Get env variables
  const port = configService.get('SERVER_PORT')
  const proxyUrl = configService.get('APP_URL_PROXY')

  // proxy order is messed up
  // app.use('/', proxy('http://localhost:8080'))
  await app.listen(port)
}
bootstrap()
