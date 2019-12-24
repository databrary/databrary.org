import express from 'express'
import { Client } from 'minio'
import _ from 'lodash'

import queue from '../queue'

import '../config'

let s3Client = new Client({
  endPoint: 'localhost',
  port: 9000,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  useSSL: false // Default is true.
})

export function routes (app: any, session: any) {
  app.post('/sign-upload',
    session,
    (req: express.Request, res: express.Response) => {
      s3Client.presignedPutObject(
        'uploads', // Bucket name
        `${req.session.dbId}-${req.body.filename}`, // Adding some non-userdefined data
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
