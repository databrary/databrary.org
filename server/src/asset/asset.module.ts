import { Module } from '@nestjs/common'
import { AssetService } from './asset.service'
import { GqlClientModule } from '../gqlClient/gqlClient.module'
import { AssetController } from './asset.controller'
import { MinioModule } from '../minio/minio.module'

@Module({
  imports: [GqlClientModule, MinioModule],
  providers: [AssetService],
  exports: [AssetService],
  controllers: [AssetController]
})
export class AssetModule {}
