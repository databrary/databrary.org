import { Module, Global } from '@nestjs/common';
import { GqlClientService } from './gqlClient.service'

@Module({
    providers: [GqlClientService],
    exports: [GqlClientService]
})
export class GqlClientModule {};