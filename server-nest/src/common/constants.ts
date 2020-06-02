import { ImageKey, ImageSize } from './types'

export const TMP_DIR = '../tmp'
export const GQL_DIR = '../gql'
export const AVATAR_FORMAT = 'png'

export const AVATAR_SIZES: Record<ImageKey, ImageSize> = {
  thumbnail: 32,
  large: 400
}
