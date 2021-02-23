import { Module } from '@nestjs/common'
import { GqlClientModule } from '../gqlClient/gqlClient.module'
import { SearchModule } from '../search/search.module'
import { FunderService } from './funder.service'

@Module({
  imports: [GqlClientModule, SearchModule],
  providers: [FunderService],
  exports: [FunderService]
})
export class FunderModule {}
