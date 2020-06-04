import { Module } from '@nestjs/common'
import { ElasticsearchModule } from '@nestjs/elasticsearch'
import { ConfigService } from '@nestjs/config'
import { SearchService } from './search.service'

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: async (config: ConfigService) => ({
        node: `${config.get('ES_NODE')}:${config.get('ES_PORT')}`
      }),
      inject: [ConfigService]
    })
  ],
  providers: [SearchService],
  exports: [SearchService]
})
export class SearchModule {}
