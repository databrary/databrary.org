import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: process.env.NODE_ENV === 'development' 
      ? ['./env/dev.env','../.env'] 
      : ['./env/prod.env','../.env'],
    isGlobal: true,
    expandVariables: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
