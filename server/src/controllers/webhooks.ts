import _ from 'lodash'
import queue from '../queue'
import { Request, Response } from 'express'
import { processAvatarUpload } from '@utils'

export const authWebhook = async (req: Request, res: Response) => {
  if (req.session) {
    if (req.session.passport.user.dbId) {
      res.json({
        'X-Hasura-Admin-Secret': 'mysecret',
        'X-Hasura-Role': 'user',
        'X-Hasura-User-Id': `${req.session.passport.user.dbId}`
      })
    } else {
      res.json({
        'X-Hasura-Admin-Secret': 'mysecret',
        'X-Hasura-Role': 'anonymous_user'
      })
    }
  } else {
    res.status(401).send('Hasura failed to Authenticate the request.')
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
