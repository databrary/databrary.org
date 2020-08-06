import { Polly } from '@pollyjs/core'
import FSPersister from '@pollyjs/persister-fs'
import NodeHttpAdapter from '@pollyjs/adapter-node-http'

Polly.register(NodeHttpAdapter)
Polly.register(FSPersister)

export const polly = new Polly('Recording Fetch', {
  adapters: ['node-http'],
  persister: 'fs',
  persisterOptions: {
    fs: {
      recordingsDir: './recordings'
    }
  }
})
