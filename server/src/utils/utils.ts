import crypto from 'crypto'
import _ from 'lodash'
import sharp from 'sharp'
import { adminQuery } from '../graphqlClient'
import { getPresignedGetObject } from '@utils'

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

export function getGravatars (email: String) {
  return {
    'thumbnail': getGravatarURL(email, 32),
    'large': getGravatarURL(email, 400)
  }
}

export async function getAvatarAsset (dbId: number) {
  const response = await adminQuery(
    `${process.cwd()}/../gql/getAvatarAsset.gql`,
    {
      dbId: dbId
    }
  )

  return response[0]
}

export async function getAvatars (bucket: string , avatar: any) {

  if (_.get(avatar.files[0], 'fileobject')) {
    const thumbnail = avatar.files[1].fileobject.size < avatar.files[2].fileobject.size
                      ? avatar.files[1].fileobject.sha256 : avatar.files[2].fileobject.sha256
    const large = avatar.files[1].fileobject.size > avatar.files[2].fileobject.size
                      ? avatar.files[1].fileobject.sha256 : avatar.files[2].fileobject.sha256
    return {
      'thumbnail': await getPresignedGetObject(bucket, thumbnail),
      'large': await getPresignedGetObject(bucket, large)
    }
  }
}

// Return
function getGravatarURL (email: String, size: number = 32) {
  if (!email) {
    return `https://gravatar.com/avatar/?s=${size}&d=monsterid`
  }
  const md5 = crypto.createHash('md5').update(email.toString()).digest('hex')
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=monsterid`
}

export function resizePicture (sourcePath: string, targetpath: string, size: number) {
  return new Promise((resolve, reject) => {
    sharp(sourcePath)
      .resize(size)
      .toFormat('png')
      .toFile(targetpath, (err, info) => {
        if (err) {
          reject(err)
        }
        resolve(info)
      })
  })
}
