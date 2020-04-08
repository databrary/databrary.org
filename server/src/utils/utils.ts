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