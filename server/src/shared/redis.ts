import _ from 'lodash'
import session from 'express-session'
import redis from 'redis'
import redisStore from 'connect-redis'
import { logger } from './Logger'

let RedisStore = redisStore(session)
let redisClient = redis.createClient()
let store = new RedisStore({ host: 'localhost', port: 6379, client: redisClient, ttl: 86400 })

export function getSessionUserId (sessionId: string) {
  return new Promise((resolve, reject) => {
    store.get(sessionId, (error, data) => {
      if (error || !data) {
        reject(error || `Redis cannot find user info for session`)
      } else if (data.passport.user.dbId) {
        resolve(data.passport.user.dbId)
      } else {
        reject(`Cannot find user id for ${sessionId} session`)
      }
    })
  })
}

export const sessionStore = store
