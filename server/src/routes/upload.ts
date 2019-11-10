import express from 'express'
import { Client } from 'minio'

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
        req.body.filename,
        1000,
        function (e, presignedUrl) {
          if (e) return console.log(e)
          console.log(presignedUrl)
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
    (req: express.Request, res: express.Response) => {
      console.log('post', JSON.stringify(req.body))
      res.send('Done')
    }
  )
}
