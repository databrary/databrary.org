import { Module } from '@nestjs/common'
import { DataciteModule } from 'src/datacite/datacite.module'
import { GqlClientModule } from 'src/gqlClient/gqlClient.module'
import { ProjectService } from './project.service'

@Module({
  imports: [DataciteModule, GqlClientModule],
  providers: [ProjectService]
})
export class ProjectModule {}
