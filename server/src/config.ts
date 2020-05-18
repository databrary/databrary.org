import { resolve } from 'path'
import { existsSync } from 'fs'
import { config } from 'dotenv'

if (existsSync('../.env')) {
  console.log('Using .env file to supply config environment variables')
  config({ path: resolve(__dirname, '../../.env') })
}