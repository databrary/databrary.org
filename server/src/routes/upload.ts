import _ from 'lodash'
import express from 'express'
import queue from '../queue'
import { adminMutate } from '../graphqlClient'
import { Client } from 'minio'
import { logger } from '@shared'

let minioClient = new Client({
  endPoint: 'localhost',
  port: 9000,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  useSSL: false // Default is true.
})

async function processAvatarUpload (input: object) {
  // TODO process here the avatar upload
  // hash and size the file
  // check if exist
  // process original and small format of the picture and rename
  // Copy to cas
  // Get userID
  // update users table with the reference to the avatar
}

export function routes (app: any, session: any) {
  app.post('/sign-upload',
    session,
    async (req: express.Request, res: express.Response) => {
      // Create a file object
      try {
        logger.debug(JSON.stringify(req.body))
        const bucketFound = await minioClient.bucketExists('uploads')
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
          minioClient.presignedPutObject(
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

  app.post('/sign-avatar-upload',
    session,
    async (req: express.Request, res: express.Response) => {
      // Create a file object
      try {
        logger.debug(JSON.stringify(req.body))
        const bucketFound = await minioClient.bucketExists('avatars')
        // Get the unique id of the upload object and make that the filename
        // TODO(Reda): Fix the return of the gql query getFileId
        if (bucketFound) {
          // Send signed url
          minioClient.presignedPutObject(
            'avatars', // Bucket name
            req.body.filename,
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
      } catch (error) {
        console.log(error)
      }
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
          await processAvatarUpload(fileInfo)
        }
      }
      res.send('done')
    }
  )
}
