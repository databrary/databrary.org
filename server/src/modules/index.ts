import { GraphQLModule } from '@graphql-modules/core' // https://github.com/Urigo/graphql-modules
import { AuthModule } from './auth'

export const AppModule = new GraphQLModule({
  imports: [
    AuthModule
  ]
})
