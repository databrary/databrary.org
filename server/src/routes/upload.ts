import express from 'express'
import { Client } from 'minio'
import _ from 'lodash'

import queue from '../queue'

import {
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY
} from '../config'

let s3Client = new Client({
  endPoint: 'localhost',
  port: 9000,
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
  useSSL: false // Default is true.
})

export function routes (app: any, sessionStore: any) {
  app.post('/sign-upload',
    (req: express.Request, res: express.Response) => {
      s3Client.presignedPutObject(
        '2019',
        `${req.session.dbId}-${req.body.filename}`,
        1000,
        function (e, presignedUrl) {
          if (e) return console.log(e)
          console.log(req.session)
          res.json({
            url: presignedUrl,
            method: 'put',
            fields: [],
            headers: {
              'content-type': req.body.contentType
            }
          })
        }
      )
    }
  )

  app.post('/webhooks/minio',
    async (req: express.Request, res: express.Response) => {
      if (!_.isEmpty(req.body)) {
        const fileInfo = req.body.Records[0].s3.object
        const id = await queue('processMinioUpload', fileInfo)
        console.log(id)
      }
      res.send('done')
    }
  )
}
