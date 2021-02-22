import { Module } from '@nestjs/common'
import { GqlClientService } from './gqlClient.service'
// TODO: Use @nestjs/graphql instead
@Module({
  providers: [GqlClientService],
  exports: [GqlClientService]
})
export class GqlClientModule {}
