import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const port = configService.get('NEST_PORT')
  console.log(`Listening on ${port}`)
  await app.listen(port, '0.0.0.0')
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
