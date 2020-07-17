import { Polly } from '@pollyjs/core'
import FSPersister from '@pollyjs/persister-fs'
import NodeHttpAdapter from '@pollyjs/adapter-node-http'
// import gql from 'graphql-tag'

// async function main () {

Polly.register(NodeHttpAdapter)
Polly.register(FSPersister)

// export const Polly = P
export const polly = new Polly('Recording some feature', {
  adapters: ['node-http'],
  persister: 'fs',
  persisterOptions: {
    fs: {
      recordingsDir: './recordings' // TODO figure out where this goes
    }
  }
})
