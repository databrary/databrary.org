import fetch from 'node-fetch'
import { createHttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache } from 'apollo-cache-inmemory'

import ApolloClient from 'apollo-client'

const httpLink = createHttpLink({
  uri: 'http://localhost:8002/v1/graphql',
  fetch,
  headers: { 'x-hasura-admin-secret': 'mysecret' }
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

export default client
