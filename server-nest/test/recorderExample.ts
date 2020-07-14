import { Polly } from '@pollyjs/core';
import FSPersister from '@pollyjs/persister-fs';
import NodeHttpAdapter from '@pollyjs/adapter-node-http'
import gql from 'graphql-tag';

async function main () {
  Polly.register(NodeHttpAdapter);
  Polly.register(FSPersister);

  const polly = new Polly('Recording some feature', {
    adapters: ['node-http'],
    persister: 'fs',
    persisterOptions: {
      fs: {
        recordingsDir: './recordings' // TODO figure out where this goes
      }
    }
  });
  
  const result = await client.query({ // TODO get graphql client from somewhere
    query: gql`
      query MyQuery {
        assets {
          id
          name
        }
      }
    `
  })
  await polly.stop()
}

main()