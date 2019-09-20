import { Client } from '@elastic/elasticsearch'
const client = new Client({ node: 'http://localhost:9200' })

async function main () {

  await client.indices.putMapping({
    index: 'projects',
    type: 'project',
    body: {
      project: {
        properties: {
          name: { type: 'text' },
          description: { type: 'text' },
          _permission: { type: 'keyword' }
        }
      }
    }
  })

  await client.index({
    index: 'projects',
    body: {
      name: 'Test',
      description: 'something here'
    }
  })
}

main()
