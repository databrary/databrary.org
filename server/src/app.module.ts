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
import { DataciteModule } from './datacite/datacite.module'
import { ProjectModule } from './project/project.module'
import { FunderService } from './funder/funder.service'
import { FunderModule } from './funder/funder.module'
import { GqlClientModule } from './gqlClient/gqlClient.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['../.env'],
      isGlobal: true
    }),
    GqlClientModule,
    KeycloakModule,
    HasuraModule,
    MinioModule,
    SearchModule,
    TaskModule,
    UserModule,
    AssetModule,
    DataciteModule,
    ProjectModule,
    FunderModule
  ],
  controllers: [AppController],
  providers: [AppService, FunderService]
})
export class AppModule {}
