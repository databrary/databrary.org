import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import fetch from 'node-fetch'

const httpLink = createHttpLink({
  uri: 'http://localhost:8002/v1/graphql',
  fetch,
  credentials: 'include'
})

// Create the apollo client
const databrary = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  connectToDevTools: true,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    }
  }
})

const datacite = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.datacite.org/graphql'
  }),
  cache: new InMemoryCache()
})

export { databrary, datacite }
