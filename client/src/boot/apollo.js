import { databrary, datacite } from '../services/apolloClient'
import VueApollo from 'vue-apollo'

export default async ({ app, Vue }) => {
  const apolloProvider = new VueApollo({
    clients: {
      databrary,
      datacite
    },
    defaultClient: databrary,
    errorHandler ({ graphQLErrors, networkError }) {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) => console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`))
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`)
      }
    }
  })

  Vue.use(VueApollo)
  app.apolloProvider = apolloProvider
}
