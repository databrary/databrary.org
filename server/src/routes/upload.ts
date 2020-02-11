import express from 'express'
import { Client } from 'minio'
import _ from 'lodash'
import { adminMutate } from '../graphqlClient'

import queue from '../queue'

import '../config'
import { logger } from '@shared'

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
      // Create a file object
      try {
        logger.debug(JSON.stringify(req.body))
        const bucketFound = await s3Client.bucketExists('uploads')
        const response = await adminMutate(
          `${process.cwd()}/../gql/insertFile.gql`,
          {
            name: decodeURIComponent(req.body.filename),
            uploadedById: req.session.dbId,
            assetId: req.body.projectId,
            fileFormatId: req.body.format
          }
        )
        // Get the unique id of the upload object and make that the filename
        // TODO(Reda): Fix the return of the gql query getFileId
        const filename = response.returning[0].id
        if (bucketFound) {
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
        } else {
          // TODO(Reda): throw an error to stop the front end uppy upload
          // TODO(Reda): Fix the return of the gql mutation removeFile
          const responseUpdateFileObject = await adminMutate(
            `${process.cwd()}/../gql/removeFile.gql`, {
              fileId: response.returning[0].id
            }
          )
        }
      } catch (error) {
        console.log(error)
      }
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
