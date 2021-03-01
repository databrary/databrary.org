import { Exclude } from 'class-transformer'
import * as crypto from 'crypto'
import { ImageKey, Index } from '../common/types'
import { AVATAR_SIZES } from '../common/constants'

export class UserDTO {
  // This is needed because of the required default_sorting_field in the schema
  @Exclude()
  docId: number

  // We use a string for docId because of the typesense limitations not allowins intger search
  @Exclude()
  docIdS: string

  @Exclude()
  authServerId: string

  @Exclude()
  emailPrimary: string

  @Exclude()
  avatarId: number

  @Exclude()
  emails: string[]

  @Exclude()
  additionalName = ''

  @Exclude()
  familyName: string

  @Exclude()
  givenName: string

  @Exclude()
  displayFullName = ''

  @Exclude()
  bio: string

  @Exclude()
  urls: string[]

  @Exclude()
  orcid: string

  id: number

  useGravatar: boolean

  image: Record<ImageKey, string> = {
    thumbnail: null,
    large: null
  }

  gravatar: Record<ImageKey, any>

  static readonly docFields = [
    { name: 'docId', type: 'int32' },
    { name: 'docIdS', type: 'string' },
    { name: 'familyName', type: 'string' },
    { name: 'givenName', type: 'string' },
    { name: 'additionalName', type: 'string' },
    { name: 'displayFullName', type: 'string' },
    { name: 'bio', type: 'string' },
    { name: 'gravatar', type: 'string' },
    { name: 'image', type: 'string' },
    { name: 'useGravatar', type: 'bool' }
  ]

  // Do not add docId or anything that is not a string or integer
  static readonly searchFields = [
    'familyName',
    'givenName',
    'additionalName',
    'displayFullName',
    'bio'
  ]

  constructor (user: Partial<UserDTO>) {
    if (user == null) throw new Error('Must provide a valid user object')

    Object.assign(this, user)

    if (user.emails == null) this.emails = [this.emailPrimary]
    if (user.displayFullName == null) this.displayFullName = `${this.givenName} ${this.familyName}`
    if (user.gravatar == null) this.gravatar = this.getGravatars()
    if (user.bio == null) this.bio = ''
  }

  get document (): Record<string, any> {
    return {
      docId: this.id,
      docIdS: `${this.id}`,
      image: JSON.stringify(this.image),
      gravatar: JSON.stringify(this.gravatar),
      useGravatar: this.useGravatar,
      bio: this.bio,
      additionalName: this.additionalName,
      familyName: this.familyName,
      givenName: this.givenName,
      displayFullName: this.displayFullName
    }
  }

  static get schema (): Record<string, unknown> {
    const name: Index = 'databrary-users'
    return {
      name: name,
      fields: UserDTO.docFields,
      default_sorting_field: 'docId'
    }
  }

  static get fields (): string {
    return UserDTO.searchFields.join(',')
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
