import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'

import { KeycloakModule } from './keycloak/keycloak.module'
import { HasuraModule } from './hasura/hasura.module'
import { MinioModule } from './minio/minio.module'
import { TaskModule } from './task/task.module'
import { UserModule } from './users/user.module'
import { AssetModule } from './asset/asset.module'
import { SearchModule } from './search/search.module'
import { IngestModule } from './ingest/ingest.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../.env'],
      isGlobal: true
    }),
    KeycloakModule,
    HasuraModule,
    MinioModule,
    SearchModule,
    TaskModule,
    UserModule,
    AssetModule,
    IngestModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
