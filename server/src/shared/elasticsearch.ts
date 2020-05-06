import { Client } from '@elastic/elasticsearch'

let client = new Client({ node: `${process.env.ES_NODE}:${process.env.ES_PORT}` })

export const esClient = client
