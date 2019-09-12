import { GraphQLModule } from '@graphql-modules/core' // https://github.com/Urigo/graphql-modules
import { AssetModule } from './asset'
import { ProjectModule } from './project'

export const AppModule = new GraphQLModule({
  imports: [
    AssetModule,
    ProjectModule
  ]
})
