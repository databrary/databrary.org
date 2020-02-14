import session from 'express-session'
import redis from 'redis'
import redisStore from 'connect-redis'
import { logger } from '../shared/Logger'

let RedisStore = redisStore(session)
let redisClient = redis.createClient()
let store = new RedisStore({ host: '172.22.0.3', port: 6379, client: redisClient, ttl: 86400 })

export function getSessionUserId (sessionId: string) {
  return new Promise((resolve, reject) => {
    store.get(sessionId, (error, data) => {
      if (error) {
        reject(error)
      } else if (data.key) {
        resolve(data.key.dbId)
      } else {
        reject(`Cannot find user id for ${sessionId} session`)
      }
    })
  })
}

export const sessionStore = store
