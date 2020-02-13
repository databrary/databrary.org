import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import fetch from 'node-fetch'
import { createHttpLink } from 'apollo-link-http'
// import { Cookies } from 'quasar'

// console.log(Cookies.getAll())

export default async ({ app, store, Vue }) => {
  console.log('apollo sessionid', store.getters['app/sessionId'])
  const httpLink = createHttpLink({
    uri: 'http://localhost:8002/v1/graphql',
    fetch,
    headers: {
      sessionID: store.getters['app/sessionId']
    }
  })

  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    connectToDevTools: true
  })

  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
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
