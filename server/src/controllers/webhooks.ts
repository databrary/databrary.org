import _ from 'lodash'
import queue from '../queue'
import { Request, Response, response } from 'express'
import { logger } from '../shared'
import { esClient } from '../shared/elasticsearch' // FIXME(Reda): ES Node accept only one client for now

export const esWebhook = async (req: Request, res: Response) => {
  const { event: { data: { new: doc } }, table: { name } } = req.body

  if (!name) return res.sendStatus(400)

  let response = 200
  switch (name) {
    case 'users':
      response = await esIngestUsers(doc)
      break
    default:
      break
  }

  // Send status to Hasura, it is the same status as the one returned by elasticsearch
  res.sendStatus(response)
}

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
    const minioObject = {
      ...req.body.Records[0].s3.object,
      'bucketName': minioBucket['name']
    }

    await queue('processMinioUpload', minioObject)
  }
  res.send('done')
}

async function esIngestUsers (user: any) {
  const USER_INDEX = 'databrary-users'
  let responseCode = 400

  if (!user) return responseCode

  const { emailPrimary, id, emails, datetimeRegistered, authServerId, urls, avatarId, ...ingest } = user
  try {
    const { body: docExists } = await esClient.exists({ index: USER_INDEX, id: id })

    if (!docExists) {
      const { statusCode: responseCode } = await esClient.create({
        id: id,
        index: USER_INDEX,
        refresh: 'true',
        body: { doc: { ...ingest } }
      })
    } else {
      const { statusCode: responseCode } = await esClient.update({
        id: id,
        index: USER_INDEX,
        body: { doc: { ...ingest } }
      })
    }
  } catch (error) {
    logger.error(error)
  }

  return responseCode
}
