import _ from 'lodash'
import express from 'express'
import queue from '../queue'
import { logger, getSessionUserId } from '@shared'

export function routes (app: any, sessionStore: any, session: any) {
  app.get('/auth/webhook',
    session,
    async (req: express.Request, res: express.Response) => {
      const sessionId = req.get('sessionID')
      logger.debug(`Hasura ${req.sessionID}`)
      const dbId = await getSessionUserId(sessionId)
      if (dbId) {
        res.json({
          'X-Hasura-Admin-Secret': 'mysecret',
          'X-Hasura-Role': 'user',
          'X-Hasura-User-Id': `${dbId}`
        })
      } else {
        logger.error(`Hasura webhook cannot find session info`)
        res.json({
          'X-Hasura-Admin-Secret': 'mysecret',
          'X-Hasura-Role': 'anonymous_user'
        })
      }
    }
  )

  app.post('/webhooks/minio',
    session,
    async (req: express.Request, res: express.Response) => {
      if (!_.isEmpty(req.body)) {
        const minioBucket = req.body.Records[0].s3.bucket
        const fileInfo = req.body.Records[0].s3.object
        if (minioBucket.name === 'uploads') {
          await queue('processMinioUpload', fileInfo)
        } else if (minioBucket.name === 'avatars') {
          // Add avatar upload here
        }
      }
      res.send('done')
    }
  )
}
