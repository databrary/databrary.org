import fetch from 'node-fetch'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import { getGatewayAddressSync } from './network'

export function createAdminClient() {
  const ip = getGatewayAddressSync()
  const headers = {
    'x-hasura-admin-secret': process.env.HASURA_SECRET
  }
  console.log(`Create Apollo Admin Client`)
  headers['X-Hasura-Role'] = 'admin'
  //Maybe Create static ips for containers will fix this issue
  const link = createHttpLink({
    uri: `http://${ip}:${process.env.HASURA_PORT}/v1/graphql`,
    fetch,
    headers
  })

  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  })
}

// TODO(Reda): remove apollo client if not used
export function createClient(userId: number) {
  const ip = getGatewayAddressSync()
  console.log(`Gateway IP ${ip}`)
  const headers = {
    'x-hasura-admin-secret': process.env.HASURA_SECRET
  }
  
  let role = 'anonymous_user'
  if (userId) {
    role = 'user'
    headers['X-Hasura-User-Id'] = userId
  }
  headers['X-Hasura-Role'] = role
  console.log(`Create Apollo Client ID ${userId}`)
  const link = createHttpLink({
    uri: `http://${ip}:${process.env.HASURA_PORT}/v1/graphql`,
    fetch,
    headers
  })
  
  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  })
}
