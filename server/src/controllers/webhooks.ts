import _ from 'lodash'
import queue from '../queue'
import { Request, Response } from 'express'
import { logger, getSessionUser } from '@shared'
import { processAvatarUpload } from '@utils'

export const authWebhook = async (req: Request, res: Response) => {
  const sessionId = req.get('sessionID')
  try {
    const user = await getSessionUser(sessionId)
    if (user['dbId']) {
      res.json({
        'X-Hasura-Admin-Secret': 'mysecret',
        'X-Hasura-Role': 'user',
        'X-Hasura-User-Id': `${user['dbId']}`
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
    const minioObject = req.body.Records[0].s3.object
    if (minioBucket.name === 'uploads') {
      await queue('processMinioUpload', minioObject)
    } else if (minioBucket.name === 'avatars') {
      await processAvatarUpload(minioObject)
    }
  }
  res.send('done')
}
