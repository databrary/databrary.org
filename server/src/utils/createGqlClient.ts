import fetch from 'node-fetch'
import ApolloClient from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

// TODO(Reda):Update uri according to the env var

export function createAdminClient () {
  const headers = {
    'x-hasura-admin-secret': process.env.HASURA_SECRET
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

// TODO(Reda): We should use createClient for actions triggered by users instead of adminClient
export function createClient (userId: number) {
  const headers = {
    'x-hasura-admin-secret': process.env.HASURA_SECRET
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
