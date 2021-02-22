import { ApolloClient, InMemoryCache, createHttpLink, gql } from '@apollo/client'
import { createWriteStream } from 'fs'
import fetch from 'cross-fetch'
import path from 'path'

// This script will fetch all funders from DataCite GraphQL API and
// create funders.json file to be ingested into databrary
// DataCite GraphQL API is slow, so this script might toake some time to finish

const datacite = new ApolloClient({
  link: createHttpLink({
    uri: 'https://api.datacite.org/graphql',
    fetch
  }),
  cache: new InMemoryCache()
})

const GET_FUNDERS = gql`
  query GetFunder ($first: Int, $after: String!) {
    funders(first: $first, after: $after) {
      totalCount
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
      nodes {
        id
        name
      }
    }
  }
`

const FILE_PATH = path.resolve('../data', 'funders.json')
const writeStream = createWriteStream(FILE_PATH)
writeStream.on('finish', () => {
  console.log('wrote all data to file')
})

async function run () {
  let after = ''
  let hasNext = false
  writeStream.write('[\n')
  do {
    const { data: { funders: { pageInfo: { hasNextPage, endCursor }, nodes } } } = await datacite.query({
      query: GET_FUNDERS,
      variables: {
        after: after,
        first: 1000
      }
    })
    nodes.forEach(({ name, id }) => {
      const node = {
        doi: id,
        name: name
      }
      writeStream.write(`${JSON.stringify(node, null, 2)},\n`)
    })
    hasNext = hasNextPage
    after = endCursor
  } while (hasNext)
  writeStream.write(']')
}

run()
  .then((_) => {
    writeStream.end()
    console.log('..wait for script to exit')
  })
  .catch((error) => {
    writeStream.end()
    console.error('script error', error.message)
  })
