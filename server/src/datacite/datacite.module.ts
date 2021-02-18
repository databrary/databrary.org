import { HttpModule, Module } from '@nestjs/common'
import { DataciteService } from './datacite.service'

@Module({
  imports: [HttpModule],
  providers: [DataciteService],
  exports: [DataciteService]
})
export class DataciteModule {}
