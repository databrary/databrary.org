import _ from 'lodash'
import mime from 'mime-types'
import { resolve } from 'path'
import { logger } from '../shared'
import { insertFile,
          getFile,
          insertFileObject,
          getFileObjectId,
          updateFile,
          canAccessAsset,
          updateUserAvatar
         } from '../units'
import { copyObject,
          getObject,
          IFileInfo,
          hashAndSizeMinio,
          hashAndSizeFile,
          fileExists,
          resizePicture,
          uploadObject } from '../utils'

const AVATAR_SIZES = [32, 400]

export default async function processMinioUpload (input: object) {
  try {
    logger.debug(`Processing Minio upload for file ${JSON.stringify(input)}`)

    let fileInfoArray: IFileInfo[] = []
    const fileId = _.toInteger(input['key'])
    const file = await getFile(fileId)

    const hasPermission = await canAccessAsset(file.assetId)
    if (!hasPermission) {
      return
    }

    // Get file info
    const fileInfo: IFileInfo = await hashAndSizeMinio(input['bucketName'], input['key'])
    if (fileInfo['size'] !== input['size']) {
      logger.error('Size mismatch') // TODO We need an error here
    }

    // fileInfo.location = 's3://minio-1.nyu.edu/cas'
    fileInfo.location = input['bucketName'] === 'avatars' ? 's3://minio-1.nyu.edu/public' : 's3://minio-1.nyu.edu/cas'
    fileInfo.fileId = fileId
    fileInfo.isUploaded = true
    fileInfo.filePath = `/${input['bucketName']}/${input['key']}`

    // Push Original file Info to the list
    fileInfoArray.push(fileInfo)

    if (input['bucketName'] === 'avatars') {
      try {
        logger.debug(`Processing an Avatar upload`)
        // original ext uploaded by user
        const ext = mime.extension(input['contentType'])
        // tmp placeholder for the original upload
        const tmpFile = resolve(`src/tasks/tmp/${input['key']}.${ext}`)
        // process Avatar upload:
        // - Download the uploaded picture into a tmp folder
        // - Resize it to different sizes (provided by the sizes list)
        // - Insert generated files into database
        // - return and array of file info for each created image
        const resizedFileInfoArr = await processAvatar(input['bucketName'], input['key'], tmpFile, ext, file.uploadedById, file.assetId)

        logger.debug(`Generated ${resizedFileInfoArr.length} files from ${tmpFile}`)
        // Add generated file the file info array
        fileInfoArray.push(...resizedFileInfoArr)
      } catch (error) {
        logger.error(error)
      } finally {
        // TODO(Reda): We need to clean the tmp folder
      }
    }

    // Loop through all the fileInfo
    for (let i = 0; i < fileInfoArray.length; i++) {
      const fileInfo = fileInfoArray[i]
      // TODO(Reda) Add target bucket to fileInfo
      const targetBucket = input['bucketName'] === 'avatars' ? 'public' : 'cas'
      const fileExistsInBucket = await fileExists(targetBucket, fileInfo.sha256)

      let fileobjectId

      if (!fileExistsInBucket) {
        let fileCopied = false

        // If the file exists in uploads bucket(means uploaded by the user), we copy it to cas
        // otherwise, we hash the file and upload it to cas directly.
        // The worker will download the uploaded picture resize it and upload it the result to cas
        logger.debug(`Copy file from ${fileInfo.filePath} to cas bucket`)
        if (fileInfo.isUploaded) {
          fileCopied = await copyObject(targetBucket, fileInfo.sha256, fileInfo.filePath, input['eTag'])
        } else {
          fileCopied = await uploadObject(targetBucket, fileInfo.sha256, fileInfo.filePath)
        }

        if (fileCopied) {
          // Create a fileobjects reference
          fileobjectId = await insertFileObject(fileInfo.size, fileInfo.md5, fileInfo.sha1, fileInfo.sha256, fileInfo.location)
        }
      } else {
        fileobjectId = await getFileObjectId(fileInfo.sha256)
      }

      if (fileobjectId != null) {
        logger.debug(`File Object ID ${fileobjectId} created for file ${fileInfo.fileId}`)
        const uploadedDatetime = new Date().toISOString() // FIXME(Reda): Why this is setting the wrong timestamp
        await updateFile(fileInfo.fileId, fileobjectId, uploadedDatetime)
      }
    }

    if (input['bucketName'] === 'avatars') {
      // build image json blob
      let image = {
        'thumbnail': null,
        'large': null
      }

      fileInfoArray.forEach((fileInfo) => {
        if (fileInfo.URI) {
          if (fileInfo.dimension === 32) {
            image['thumbnail'] = `http://localhost:9000/public/${fileInfo.sha256}`
          } else if (fileInfo.dimension === 400) {
            image['large'] = `http://localhost:9000/public/${fileInfo.sha256}`
          }
        }
      })
      // update user
      await updateUserAvatar(file.uploadedById, file.assetId, image)
    }
    logger.debug(`File ${fileId} processed`)
  } catch (error) {
    logger.error(`Process Minio Upload Error: ${error}`)
  }
}

async function processAvatar (bucketName: string, key: string, tmpFile: string, sourceExt: string, uploadedById: number, assetId: number) {
  let result: IFileInfo[] = []
  await getObject(bucketName, key, tmpFile)

  for (let i = 0; i < AVATAR_SIZES.length; i++) {
    const size = AVATAR_SIZES[i]
    const fileName = `${key}_${size}.png`
    // TODO(Reda) maybe the tmp dir will change
    const targetPath = resolve(`src/tasks/tmp/${fileName}`)

    await resizePicture(tmpFile, targetPath, size)
    const insertFileId = await insertFile(fileName, uploadedById, assetId, 'png')

    // Hash processed pictures
    const fileInfo: IFileInfo = await hashAndSizeFile(targetPath)

    fileInfo.location = bucketName === 'avatars' ? 's3://minio-1.nyu.edu/public' : 's3://minio-1.nyu.edu/cas'
    // fileInfo.location = 's3://minio-1.nyu.edu/cas'
    fileInfo.fileId = insertFileId
    fileInfo.isUploaded = false
    fileInfo.filePath = targetPath
    fileInfo.dimension = size
    fileInfo.URI = `http://localhost:9000/public/${fileInfo.sha256}`
    result.push(fileInfo)
  }

  return result
}
