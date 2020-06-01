import { Exclude } from 'class-transformer'
import * as crypto from 'crypto'
import { ImageKey, ImageSize } from 'src/common/types'
import { AVATAR_SIZES } from 'src/common/constants'

export class UserDTO {
  @Exclude()
  authServerId: string

  @Exclude()
  emailPrimary: string

  @Exclude()
  avatarId: number

  @Exclude()
  emails: string[]

  @Exclude()
  additionalName: string

  @Exclude()
  familyName: string

  @Exclude()
  givenName: string

  @Exclude()
  displayFullName: string

  @Exclude()
  bio: string

  @Exclude()
  urls: string[]

  @Exclude()
  orcid: string

  id: number

  useGravatar: boolean

  image: Record<ImageKey, ImageSize> = {
    thumbnail: null,
    large: null
  } 

  gravatar: Record<ImageKey, any>

  constructor (user: Partial<UserDTO>) {
    if (!user) return

    Object.assign(this, user)

    if (!user.emails) this.emails = [this.emailPrimary]
    if (!user.displayFullName) this.displayFullName = `${this.givenName} ${this.familyName}`
    if (!user.gravatar) this.gravatar = this.getGravatars()
  }

  private getGravatars (): Record<ImageKey, any> {
    return this.emailPrimary ? {
      thumbnail: this.getGravatarURL(AVATAR_SIZES.thumbnail),
      large: this.getGravatarURL(AVATAR_SIZES.large)
    } : null
  }

  private getGravatarURL (size = 32) {
    const md5 = this.emailPrimary
      ? crypto.createHash('md5').update(this.emailPrimary.toString()).digest('hex')
      : ''

    return `https://gravatar.com/avatar/${md5}?s=${size}&d=monsterid`
  }
}
