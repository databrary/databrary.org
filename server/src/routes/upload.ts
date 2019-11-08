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

  app.get('/webhooks/minio',
    (req: express.Request, res: express.Response) => {
      console.log('get', req.body)
    }
  )

  app.post('/webhooks/minio',
    (req: express.Request, res: express.Response) => {
      console.log('post', req.body)
    }
  )

  app.put('/webhooks/minio',
    (req: express.Request, res: express.Response) => {
      console.log('put', req.body)
    }
  )
}
