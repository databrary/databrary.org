import { Request, Response, NextFunction } from 'express'
import { adminMutate, adminQuery } from '../graphqlClient'
import { logger } from '@shared'
import { getMinioClient, bucketExists } from '@utils'

export const signUpload = async (req: Request, res: Response) => {
  try {
    let response
    let bucketName = 'uploads'
    let assetId = req.body.projectId
    if (req.body.uploadType === 'avatar') {
      bucketName = 'avatars'
      // Get the unique id of the upload object and make that the filename
      response = await adminQuery(
        `${process.cwd()}/../gql/getAvatarAsset.gql`,
        {
          dbId: req.user['dbId']
        }
      )
      assetId = response[0].id
      // TODO(Reda): Update avatarId in the postgres trigger function
      response = await adminMutate(
        `${process.cwd()}/../gql/updateUserAvatar.gql`,
        {
          dbId: req.user['dbId'],
          avatarId: assetId
        }
      )
    }

    const bucketFound = await bucketExists(bucketName)
    response = await adminMutate(
      `${process.cwd()}/../gql/insertFile.gql`,
      {
        name: decodeURIComponent(req.body.filename),
        uploadedById: req.user['dbId'],
        assetId: assetId,
        fileFormatId: req.body.format
      }
    )
    // Get the unique id of the upload object and make that the filename
    const filename = response.returning[0].id

    if (bucketFound) {
      // Send signed url
      getMinioClient().presignedPutObject(
        bucketName, // Bucket name
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
      response = await adminMutate(
        `${process.cwd()}/../gql/removeFile.gql`, {
          fileId: response.returning[0].id
        }
      )
    }
  } catch (error) {
    logger.error(error)
  }
}
