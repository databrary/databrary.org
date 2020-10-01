import { Module } from '@nestjs/common'
// import { ElasticsearchModule } from '@nestjs/elasticsearch'
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
  // imports: [
  //   ElasticsearchModule.registerAsync({
  //     useFactory: async (config: ConfigService) => ({
  //       // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  //       node: `${config.get('ES_NODE')}:${config.get('ES_PORT')}`
  //     }),
  //     inject: [ConfigService]
  //   })
  // ],
  controllers: [SearchController],
  providers: [SearchService, typesenseConfig],
  exports: [SearchService]
})
export class SearchModule {}
