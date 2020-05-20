import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { GqlClientModule } from 'src/gqlClient/gqlClient.module'

@Module({
  imports: [GqlClientModule],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
