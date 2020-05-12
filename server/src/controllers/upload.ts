import { Request, Response, NextFunction } from 'express'
import { logger } from '../shared'
import { getMinioClient, bucketExists } from '../utils'
import { insertFile, insertAvatarAsset, updateUserAvatar } from '../units'

export const signUpload = async (req: Request, res: Response) => {
  try {
    let response
    let bucketName = 'uploads'
    let assetId = req.body.projectId
    if (req.body.uploadType === 'avatar') {
      bucketName = 'avatars'
      assetId = await insertAvatarAsset(req.user['dbId'])
      // Maybe This should be added in the webhook
      response = await updateUserAvatar(req.user['dbId'], assetId)
    }

    const bucketFound = await bucketExists(bucketName)

    if (bucketFound) {
      const filename = await insertFile(req.body.filename, req.user['dbId'], assetId, req.body.format)
      // Send signed url
      getMinioClient().presignedPutObject(
        bucketName, // Bucket name
        encodeURIComponent(filename),
        1000,
        function (err, presignedUrl) {
          if (err) return console.log(err)
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
