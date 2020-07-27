import { Module } from '@nestjs/common'
import { AssetService } from './asset.service'
import { GqlClientModule } from '../gqlClient/gqlClient.module'

@Module({
  imports: [GqlClientModule],
  providers: [AssetService],
  exports: [AssetService]
})
export class AssetModule {}
