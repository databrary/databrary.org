import _ from 'lodash'
import session from 'express-session'
import redis from 'redis'
import redisStore from 'connect-redis'
import { logger } from './Logger'

let RedisStore = redisStore(session)
let redisClient = redis.createClient()
let store = new RedisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400 })

export function getSessionUser (sessionId: string) {
  return new Promise((resolve, reject) => {
    store.get(sessionId, (error, data) => {
      if (error || !data) {
        reject(error || `Redis cannot find data for the session ${sessionId}`)
      } else if (data.passport.user) {
        resolve(data.passport.user)
      } else {
        reject(`Cannot find user id for ${sessionId} session`)
      }
    })
  })
}

export const sessionStore = store
