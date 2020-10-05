import { NestFactory, NestApplication } from '@nestjs/core'
import { INestApplicationContext } from '@nestjs/common'
import { AppModule } from './app.module'

export async function bootstrap (): Promise<INestApplicationContext> {
  return await NestFactory.createApplicationContext(AppModule)
}
