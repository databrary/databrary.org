import { Module } from '@nestjs/common'

import { UserService } from './user.service'
import { GqlClientModule } from 'src/gqlClient/gqlClient.module'
import { SearchModule } from 'src/search/search.module'

@Module({
  imports: [GqlClientModule, SearchModule],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
