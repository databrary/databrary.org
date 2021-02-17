import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SearchService } from './search.service'
import { SearchController } from './search.controller'

const typesenseConfig = {
  provide: 'TYPESENSE_CONFIG',
  useFactory: (config: ConfigService) => ({
    nodes: [{
      host: config.get('TYPESENSE_HOST'),
      port: config.get('TYPESENSE_PORT'),
      protocol: 'http'
    }],
    apiKey: config.get('TYPESENSE_API_KEY'),
    connectionTimeoutSeconds: 2
  }),
  inject: [ConfigService]
}
@Module({
  controllers: [SearchController],
  providers: [SearchService, typesenseConfig],
  exports: [SearchService]
})
export class SearchModule {}
