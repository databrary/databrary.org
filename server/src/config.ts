import { resolve } from 'path'
import { config } from 'dotenv'
import { logger } from '@shared'
import commandLineArgs from 'command-line-args'

// Setup command line options
const options = commandLineArgs([
  {
    name: 'env',
    alias: 'e',
    defaultValue: 'prod',
    type: String
  }
])

// Set docker env file
let result = config({
  path: resolve(__dirname, '../../.env')
})

if (result.error) {
  throw result.error
}

// Set the server env file
result = config({
  path: resolve(__dirname, `../env/${options.env}.env`)
})

if (result.error) {
  throw result.error
}

// TODO(Reda): Add stop process if env variables not found
