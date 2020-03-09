import { Request, Response, NextFunction } from 'express'
import { adminMutate } from '../graphqlClient'
import { logger } from '@shared'
import { getMinioClient, bucketExists } from '@utils'

export const signUpload = async (req: Request, res: Response) => {
  try {
    logger.debug(JSON.stringify(req.body))
    const bucketFound = await bucketExists('uploads')
    const response = await adminMutate(
      `${process.cwd()}/../gql/insertFile.gql`,
      {
        name: decodeURIComponent(req.body.filename),
        uploadedById: req.user['dbId'],
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
}

export const signAvatarUpload = async (req: Request, res: Response) => {
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
    logger.error(error)
  }
}
