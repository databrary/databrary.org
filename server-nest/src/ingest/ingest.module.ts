import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { AssetModule } from 'src/asset/asset.module'
import { FileModule } from 'src/file/file.module'
import { KeycloakModule } from 'src/keycloak/keycloak.module'
import { UserModule } from '../users/user.module'
import { IngestController } from './ingest.controller'
import { IngestService } from './ingest.service'

@Module({
  imports: [
    MulterModule.register({
      dest: '../data'
    }),
    KeycloakModule,
    UserModule,
    AssetModule,
    FileModule
  ],
  controllers: [IngestController],
  providers: [IngestService]
})
export class IngestModule {}
