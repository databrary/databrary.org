import { Client } from 'typesense'

const typesenseClient = new Client({
  nodes: [
    {
      host: 'localhost',
      path: '/typesense',
      port: '8000',
      protocol: 'http'
    }
  ],
  apiKey: 'e5325d85-7570-4d95-b95d-60c99cfba4bf',
  connectionTimeoutSeconds: 2
})

export { typesenseClient }
