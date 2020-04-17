import _ from 'lodash'
import mime from 'mime-types'
import { adminQuery, adminMutate } from '../graphqlClient'
import { resolve } from 'path'
import { logger } from '@shared'
import { copyObject,
          getObject,
          IFileInfo,
          canAccessAsset,
          hashAndSizeMinio,
          hashAndSizeFile,
          fileExists,
          resizePicture,
          uploadObject } from '@utils'

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

    fileInfo.location = 's3://minio-1.nyu.edu/cas'
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
      const fileExistsInCas = await fileExists('cas', fileInfo.sha256)

      let fileobjectId

      if (!fileExistsInCas) {
        let fileCopied = false

        // If the file exists in uploads bucket(means uploaded by the user), we copy it to cas
        // otherwise, we hash the file and upload it to cas directly.
        // The worker will download the uploaded picture resize it and upload it the result to cas
        logger.debug(`Copy file from ${fileInfo.filePath} to cas bucket`)
        if (fileInfo.isUploaded) {
          fileCopied = await copyObject('cas', fileInfo.sha256, fileInfo.filePath, input['eTag'])
        } else {
          fileCopied = await uploadObject('cas', fileInfo.sha256, fileInfo.filePath)
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
    logger.debug(`File ${fileId} processed`)
  } catch (error) {
    logger.error(`Process Minio Upload Error: ${error}`)
  }
}

// Get the file object based on the key
async function getFile (fileId: number) {
  const response = await adminQuery(
    `${process.cwd()}/../gql/getFile.gql`,
    {
      id: fileId
    }
  )
  return response[0]
}

// Insert new File and return file ID
async function insertFile (fileName: string, dbId: number, assetId: number, fileExt: string) {
  const response = await adminMutate(
    `${process.cwd()}/../gql/insertFile.gql`,
    {
      name: fileName,
      uploadedById: dbId,
      assetId: assetId,
      fileFormatId: fileExt
    }
  )
  return response.returning[0].id
}

//  Insert a new File object and return the object file ID
async function insertFileObject (size: number, md5: string, sha1: string, sha256: string, location: string) {
  const response = await adminMutate(
    `${process.cwd()}/../gql/insertFileObjectOnUpload.gql`, {
      size: size,
      md5: md5,
      sha1: sha1,
      sha256: sha256,
      location: location
    })

  return response.returning[0].id
}

// Get file object id from sha256
async function getFileObjectId (sha256: string) {
  const response = await adminMutate(
    `${process.cwd()}/../gql/getFileObjectId.gql`, { // TODO brittle for a number of reasons
      sha256: sha256
    }
  )
  return response[0].id
}

async function updateFile (fileId: number, fileobjectId: number, uploadedDatetime: any) {
  const response = await adminMutate(
    `${process.cwd()}/../gql/updateFile.gql`, {
      fileId: fileId,
      fileobjectId: fileobjectId,
      uploadedDatetime: uploadedDatetime
    })
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

    fileInfo.location = 's3://minio-1.nyu.edu/cas'
    fileInfo.fileId = insertFileId
    fileInfo.isUploaded = false
    fileInfo.filePath = targetPath
    result.push(fileInfo)
  }

  return result
}