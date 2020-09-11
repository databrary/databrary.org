import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import VueApollo from 'vue-apollo'
import fetch from 'node-fetch'

export default async ({ app, Vue }) => {
  const httpLink = createHttpLink({
    uri: 'http://localhost:8002/v1/graphql',
    fetch,
    credentials: 'include'
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
