import _ from 'lodash'
import express from 'express'
import { adminMutate } from '../graphqlClient'
<<<<<<< HEAD
import { logger } from '@shared'
import { getMinioClient, bucketExists } from '@utils'
=======

import queue from '../queue'

import '../config'

let s3Client = new Client({
  endPoint: 'localhost',
  port: 9000,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  useSSL: false // Default is true.
})
>>>>>>> 90bc1d9650211f172feb68c5c6ec8d68e1e9ea84

export function routes (app: any, session: any) {
  app.post('/sign-upload',
    session,
    async (req: express.Request, res: express.Response) => {
      // Create a file object
<<<<<<< HEAD
      if (req.session.key) {
        try {
          logger.debug(JSON.stringify(req.body))
          const bucketFound = await bucketExists('uploads')
          const response = await adminMutate(
            `${process.cwd()}/../gql/insertFile.gql`,
            {
              name: decodeURIComponent(req.body.filename),
              uploadedById: req.session.key['dbId'],
              assetId: req.body.projectId,
              fileFormatId: req.body.format
            }
          )
          // Get the unique id of the upload object and make that the filename
          // TODO(Reda): Fix the return of the gql query getFileId
          const filename = response.returning[0].id
          if (bucketFound) {
            // Send signed url
            getMinioClient().presignedPutObject(
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
          logger.error(error)
        }
      } else {
        res.redirect('/login')
      }
    }
  )

  app.post('/sign-avatar-upload',
    session,
    async (req: express.Request, res: express.Response) => {
      // Create a file object
      if (req.session.key) {
        try {
          logger.debug(JSON.stringify(req.body))
          const bucketFound = await bucketExists('avatars')
          // Get the unique id of the upload object and make that the filename
          // TODO(Reda): Fix the return of the gql query getFileId
          if (bucketFound) {
            // Send signed url
            getMinioClient().presignedPutObject(
              'avatars', // Bucket name
              req.body.filename,
=======
      try {
        const bucketFound = 1 // await s3Client.bucketExists('uploads')
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
        const filename = response.returning[0].id
        if (bucketFound) {
          // Send signed url
          s3Client.presignedPutObject(
              'uploads', // Bucket name
              encodeURIComponent(filename),
>>>>>>> 90bc1d9650211f172feb68c5c6ec8d68e1e9ea84
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
<<<<<<< HEAD
          }
        } catch (error) {
          logger.error(error)
=======
        } else {
          // TODO(Reda): throw an error to stop the front end uppy upload
          const responseUpdateFileObject = await adminMutate(
            `${process.cwd()}/../gql/removeFile.gql`, {
              fileId: response.returning[0].id
            }
          )
>>>>>>> 90bc1d9650211f172feb68c5c6ec8d68e1e9ea84
        }
      } else {
        res.redirect('/login')
      }
    }
  )
}
