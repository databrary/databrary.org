import { resolve } from 'path'
import { existsSync } from 'fs'
import { config } from 'dotenv'
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

let result

if (existsSync('../.env')) {
  console.log('Using .env file to supply config environment variables')
  config({ path: resolve(__dirname, '../../.env') })
} else {
  console.log('Using .env.default file to supply config environment variables')
  config({ path: resolve(__dirname, '../../.env.default') }) // you can delete this after you create your own .env file!
}

// Set docker env file
result = config({
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

export const dev = options !== 'prod'

// TODO(Reda): Add stop process if env variables not found
