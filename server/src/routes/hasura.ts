import express from 'express'
import { logger } from '@shared'

export function routes (app: any, sessionStore: any) {
  app.get('/auth/webhook',
    (req: express.Request, res: express.Response) => {
      const sessionId = req.get('sessionID')
      logger.debug(`Session ID ${sessionId}`)
      // TODO Handle sessionId undefined
      sessionStore.get(sessionId, (err, data) => {
        if (data.dbId) {
          res.json({
            'X-Hasura-Admin-Secret': 'mysecret',
            'X-Hasura-Role': 'user',
            'X-Hasura-User-Id': `${data.dbId}`
          })
        } else {
          res.json({
            'X-Hasura-Admin-Secret': 'mysecret',
            'X-Hasura-Role': 'anonymous_user'
          })
        }
      })
    }
  )
}
