import { Exclude } from 'class-transformer'
import * as crypto from 'crypto'
import { ImageKey, ImageSize } from '../common/types'
import { AVATAR_SIZES } from '../common/constants'

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
    if (user == null) return

    Object.assign(this, user)

    if (user.emails == null) this.emails = [this.emailPrimary]
    if (user.displayFullName == null) this.displayFullName = `${this.givenName} ${this.familyName}`
    if (user.gravatar == null) this.gravatar = this.getGravatars()
  }

  get document (): Partial<UserDTO> {
    return {
      image: this.image,
      gravatar: this.gravatar,
      useGravatar: this.useGravatar,
      bio: this.bio,
      additionalName: this.additionalName,
      familyName: this.familyName,
      givenName: this.givenName,
      displayFullName: this.displayFullName
    }
  }

  private getGravatars (): Record<ImageKey, any> {
    return this.emailPrimary != null
      ? {
        thumbnail: this.getGravatarURL(AVATAR_SIZES.thumbnail),
        large: this.getGravatarURL(AVATAR_SIZES.large)
      }
      : null
  }

  private getGravatarURL (size = 32) {
    const md5 = this.emailPrimary != null
      ? crypto
        .createHash('md5')
        .update(this.emailPrimary.toString())
        .digest('hex')
      : ''

    return `https://gravatar.com/avatar/${md5}?s=${size}&d=monsterid`
  }
}
