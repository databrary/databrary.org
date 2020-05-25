import { Module } from '@nestjs/common'
import { HasuraController } from './hasura.controller'

@Module({
  controllers: [HasuraController]
})
export class HasuraModule {}
