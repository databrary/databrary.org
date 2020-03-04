import crypto from 'crypto'
import _ from 'lodash'
import { adminQuery, adminMutate } from '../graphqlClient'
import { logger } from '@shared'
import { copyObject, IFileInfo, canAccessAsset, hashAndSizeMinio, fileExists } from '@utils'


export function uuid () {
  let s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('')
}

// Return 
export function getGravatarURL(email: String, size: number = 32) {
  if (!email) {
    return `https://gravatar.com/avatar/?s=${size}&d=monsterid`
  }
  const md5 = crypto.createHash('md5').update(email.toString()).digest('hex')
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=monsterid`
}

export async function processAvatarUpload(minioObject: object) {
  const fileId = _.toInteger(minioObject['key'])
  // Get the file object based on the key
  let response = await adminQuery(
    `${process.cwd()}/../gql/getFile.gql`,
    {
      id: fileId
    }
  )
  const file = response[0]
  const hasPermission = await canAccessAsset(file.assetId)
  if (!hasPermission) {
    return
  }

  // Get file info
  const fileInfo: IFileInfo = await hashAndSizeMinio('avatars', minioObject['key'])
  if (fileInfo['size'] !== minioObject['size']) {
    logger.error('Size mismatch') // TODO We need an error here
  }

  fileInfo.location = 's3://minio-1.nyu.edu/cas'

  const fileExistsInCas = await fileExists('cas', fileInfo.sha256)

  let fileobjectId

  if (!fileExistsInCas) {

    const fileCopied = await copyObject('cas', fileInfo.sha256, `/avatars/${minioObject['key']}`, minioObject['eTag'])
    if (fileCopied) {
      // Create a fileobjects reference
      response = await adminMutate(
        `${process.cwd()}/../gql/insertFileObjectOnUpload.gql`, // TODO brittle for a number of reasons
        fileInfo
      )
      fileobjectId = response.returning[0].id
    }
  } else {
    response = await adminMutate(
      `${process.cwd()}/../gql/getFileObjectId.gql`, { // TODO brittle for a number of reasons
        sha256: fileInfo.sha256
      }
    )
    fileobjectId = response[0].id
  }

  if (fileobjectId != null) {
    const uploadedDatetime = new Date().toISOString()

    response = await adminMutate(
      `${process.cwd()}/../gql/updateFile.gql`, {
        fileId: fileId,
        fileobjectId: fileobjectId,
        uploadedDatetime: uploadedDatetime
      }
    )

    logger.info(`Avatar ${fileId} Uploaded`)
  }
}