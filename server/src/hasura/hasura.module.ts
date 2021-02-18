import { Module } from '@nestjs/common'
import { HasuraController } from './hasura.controller'
import { HasuraModule as HasuraEventModule } from '@golevelup/nestjs-hasura'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    HasuraEventModule.forRootAsync(HasuraEventModule, {
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secretFactory: config.get<string>('HASURA_EVENT_TOKEN'),
        secretHeader: config.get<string>('HASURA_EVENT_HEADER')
      })
    })
  ],
  controllers: [HasuraController]
})
export class HasuraModule {}
