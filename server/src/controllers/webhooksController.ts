import _ from 'lodash'
import queue from '../queue'
import { Request, Response, NextFunction } from 'express'
import { logger, getSessionUserId } from '@shared'

export const authWebhook = async (req: Request, res: Response) => {
  const sessionId = req.get('sessionID')
  try {
    const dbId = await getSessionUserId(sessionId)
    if (dbId) {
      res.json({
        'X-Hasura-Admin-Secret': 'mysecret',
        'X-Hasura-Role': 'user',
        'X-Hasura-User-Id': `${dbId}`
      })
    } else {
      res.json({
        'X-Hasura-Admin-Secret': 'mysecret',
        'X-Hasura-Role': 'anonymous_user'
      })
    }
  } catch (error) {
    logger.error(`Auth Webhook: ${error}`)
  }
}

export const minioWebhook = async (req: Request, res: Response) => {
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
