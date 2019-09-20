import { GraphQLModule } from '@graphql-modules/core' // https://github.com/Urigo/graphql-modules
import { AssetModule } from './asset'

export const AppModule = new GraphQLModule({
  imports: [
    AssetModule
  ]
})
