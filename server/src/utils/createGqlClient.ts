import fetch from 'node-fetch'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'

// TODO(Reda):Update uri according to the env var

export function createAdminClient () {
  const headers = {
    'x-hasura-admin-secret': 'mysecret'
  }

  headers['X-Hasura-Role'] = 'admin'

  const link = createHttpLink({
    uri: 'http://localhost:8002/v1/graphql',
    fetch,
    headers
  })

  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  })
}

export function createClient (userId: number) {
  const headers = {
    'x-hasura-admin-secret': 'mysecret'
  }

  let role = 'anonymous_user'
  if (userId) {
    role = 'user'
    headers['X-Hasura-User-Id'] = userId
  }
  headers['X-Hasura-Role'] = role

  const link = createHttpLink({
    uri: 'http://localhost:8002/v1/graphql',
    fetch,
    headers
  })

  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  })
}
