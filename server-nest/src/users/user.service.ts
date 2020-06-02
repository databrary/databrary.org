import { Injectable } from '@nestjs/common'
import { isEmpty } from 'lodash'
import { resolve } from 'path'

import { GqlClientService } from 'src/gqlClient/gqlClient.service'
import { UserDTO } from 'src/dtos/user.dto'

import { GQL_DIR } from 'src/common/constants'
@Injectable()
export class UserService {
  constructor(private readonly client: GqlClientService) {}

  async findByEmail(emailPrimary: string) {
    const users = await this.client.adminQuery(
      resolve(GQL_DIR, `getUserByEmail.gql`),
      { emailPrimary }
    )

    return isEmpty(users) ? null : users[0]
  }

  async findByAuthId(authServerId: string) {
    const users = await this.client.adminQuery(
      resolve(GQL_DIR, `getUserByAuthId.gql`),
      { authServerId },
      'no-cache'
    )

    return isEmpty(users) ? null : users[0]
  }

  async createUser(user: UserDTO) {
    const { returning: users } = await this.client.adminMutate(
      resolve(GQL_DIR, `registerUser.gql`),
      user
    )

    return isEmpty(users) ? null : users[0]
  }

  // TODO(Reda): Move this to a new module
  async insertAsset(
    id: number,
    name: string,
    assetType: string,
    privacyType: string
  ) {
    const { returning: assets } = await this.client.adminMutate(
      resolve(GQL_DIR, `insertAsset.gql`),
      {
        id: id,
        name: name,
        asset_type: assetType,
        privacy_type: privacyType
      }
    )

    return isEmpty(assets) ? null : assets[0]
  }

  async updateUserAvatar(id: number, avatarId: number, image: object) {
    const { returning: users } = await this.client.adminMutate(
      resolve(GQL_DIR, `updateUserAvatar.gql`),
      {
        id: id,
        avatarId: avatarId,
        image: image
      }
    )

    return isEmpty(users) ? null : users[0]
  }
}
