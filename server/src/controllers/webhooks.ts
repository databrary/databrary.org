import _ from 'lodash'
import queue from '../queue'
import { Request, Response } from 'express'
import { logger, getSessionUserId, updateUsersPrimaryEmail } from '@shared'
import { processAvatarUpload } from '@utils'

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
    const minioObject = req.body.Records[0].s3.object
    if (minioBucket.name === 'uploads') {
      await queue('processMinioUpload', minioObject)
    } else if (minioBucket.name === 'avatars') {
      await processAvatarUpload(minioObject)
    }
  }
  res.send('done')
}

export const emailWebhook = async (req: Request, res: Response) => {
  if (!_.isEmpty(req.body)) {
    try {
      const authServerId = req.body.event.data.new.auth_server_id
      const primaryEmail = req.body.event.data.new.email_primary
      await updateUsersPrimaryEmail(authServerId, primaryEmail)
    } catch (error) {
      logger.error(error)
    }
  }
  res.send('done')
}
