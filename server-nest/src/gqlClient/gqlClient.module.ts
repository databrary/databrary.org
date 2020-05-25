import { Module } from '@nestjs/common'
import { GqlClientService } from './gqlClient.service'

@Module({
  providers: [GqlClientService],
  exports: [GqlClientService]
})
export class GqlClientModule {};
