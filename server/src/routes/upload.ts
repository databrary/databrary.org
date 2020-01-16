import express from 'express'
import { Client } from 'minio'
import _ from 'lodash'
import { adminMutate } from '../graphqlClient'

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
    async (req: express.Request, res: express.Response) => {
      console.log(req.body)
      // Create a file object
      const response = await adminMutate(
        `${process.cwd()}/../gql/insertFile.gql`,
        {
          name: decodeURIComponent(req.body.filename),
          uploaded_by_id: req.session.dbId,
          asset_id: req.body.projectId
        }
      )

      // Get the unique id of the upload object and make that the filename
      const filename = response.returning[0].id

      // Send signed url
      s3Client.presignedPutObject(
        'uploads', // Bucket name
        encodeURIComponent(filename),
        1000,
        function (e, presignedUrl) {
          if (e) return console.log(e)
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
        await queue('processMinioUpload', fileInfo)
      }
      res.send('done')
    }
  )
}
