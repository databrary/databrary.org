import _ from 'lodash'
import express from 'express'
import { adminMutate } from '../graphqlClient'
import queue from '../queue'
import { logger } from '@shared'
import { copyObject, IFileInfo, hashAndSizeMinio, fileExists } from '@utils'

async function processAvatarUpload (input: object, authServerId: string) {
  // TODO process here the avatar upload
  // const fileId = _.toInteger(input['key'])
  // hash and size the file
  const fileInfo: IFileInfo = await hashAndSizeMinio('uploads', input['key'])
  if (fileInfo['size'] !== input['size']) {
    logger.error('Size mismatch') // TODO We need an error here
  }
  // check if exist
  fileInfo.location = 's3://minio-1.nyu.edu/cas'

  const fileExistsInCas = await fileExists('cas', fileInfo.sha256)

  let fileobjectId
  let response

  if (!fileExistsInCas) {
    const fileCopied = await copyObject('cas', fileInfo.sha256, `/avatars/${input['key']}`, input['eTag'])
    if (fileCopied) {
      // process original and small format of the picture and rename
      response = await adminMutate(
        `${process.cwd()}/../gql/insertFileObjectOnUpload.gql`, // TODO brittle for a number of reasons
        fileInfo
      )
      fileobjectId = response.returning[0].id

    }
  } else {
    response = await adminMutate(
      `${process.cwd()}/../gql/getFileObjectId.gql`, { // TODO brittle for a number of reasons
        sha256: fileInfo.sha256
      }
    )
    fileobjectId = response[0].id
  }

  if (fileobjectId != null) {
    logger.info(`File Object ID ${fileobjectId}`)
    response = await adminMutate(
      `${process.cwd()}/../gql/updateUserAvatar.gql`,
      {
        authServerId: authServerId,
        fileobjectId: fileobjectId
      }
    )

    logger.info(`User ${authServerId} processed`)
  }
}

export function routes (app: any, sessionStore: any) {
  app.get('/auth/webhook',
    (req: express.Request, res: express.Response) => {
      const sessionId = req.get('sessionID')
      sessionStore.get(sessionId, (err, data) => {
      // logger.debug(`Hasura webhook session: ${JSON.stringify(req.get('sessionID'))} dbId: ${JSON.stringify(req.get('dbId'))}`)
        if (err) {
          logger.error(`Hasura Authentication error ${err}`)
        }
        if (data.dbId) {
          res.json({
            'X-Hasura-Admin-Secret': 'mysecret',
            'X-Hasura-Role': 'user',
            'X-Hasura-User-Id': `${data.dbId}`
          })
        } else {
          logger.error(`Hasura webhook cannot find session info`)
          res.json({
            'X-Hasura-Admin-Secret': 'mysecret',
            'X-Hasura-Role': 'anonymous_user'
          })
        }
      })
    }
  )

  app.post('/webhooks/minio',
    async (req: express.Request, res: express.Response) => {
      if (!_.isEmpty(req.body)) {
        const minioBucket = req.body.Records[0].s3.bucket
        const fileInfo = req.body.Records[0].s3.object
        if (minioBucket.name === 'uploads') {
          logger.debug('Uploads bucket PUT event')
          await queue('processMinioUpload', fileInfo)
        } else if (minioBucket.name === 'avatars') {
          logger.debug('Avatars bucket PUT event')
          logger.debug(`avatar webhook ${JSON.stringify(req.session)}`)
          const sessionId = req.get('sessionID')
          sessionStore.get(sessionId, (err, data) => {
            if (err) {
              logger.error(`Minio webhook cannot get session store data ${err}`)
            }
            if (data.dbId) {
              logger.debug(`avatar webhook ${JSON.stringify(data)}`)
            }
          })
          // if (req.session.dbId) {
          //   await processAvatarUpload(fileInfo, req.session.dbId)
          // } else {
          //   logger.error(`Avatar upload not processed`)
          // }
        }
      }
      res.send('done')
    }
  )
}