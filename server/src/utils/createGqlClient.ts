import fetch from 'node-fetch'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import ApolloClient from 'apollo-client'
import dns from 'dns'

const HASURA_SERVICE = 'graphql-engine'

// async function getIp(domain){
//   return new Promise((resolve, reject) => {
//       dns.lookup(domain, (err, address, family) => {
//           if(err) reject(err);
//           resolve(address);
//       })
//  })
// }

// async function getBaseURI(domain, port) {
//   try {
//     const IP = await getIp(domain)
//     console.log(`IP: ${IP}`)
//     return `${IP}:${port}`    
//   } catch (error) {
//     console.log(error)
//   }
// } 

export function createAdminClient () {
  const headers = {
    'x-hasura-admin-secret': process.env.HASURA_SECRET
  }
  console.log(`Create Apollo Admin Client`)
  headers['X-Hasura-Role'] = 'admin'
  //Maybe Create static ips for containers will fix this issue
  const link = createHttpLink({
    uri: 'http://172.23.0.1:8002/v1/graphql', // Hasura runs on docker gateway ip 
    fetch,
    headers
  })

  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  })
}

// TODO(Reda): remove apollo client if not used
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
  console.log(`Create Apollo Client`)
  const link = createHttpLink({
    uri: 'http://172.23.0.1:8002/v1/graphql',
    fetch,
    headers
  })

  return new ApolloClient({
    link,
    cache: new InMemoryCache()
  })
}
