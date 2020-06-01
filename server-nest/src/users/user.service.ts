import { Injectable } from '@nestjs/common'

import { GqlClientService } from 'src/gqlClient/gqlClient.service'
import { UserDTO } from 'src/dtos/user.dto'

import { isEmpty } from 'lodash'

@Injectable()
export class UserService {
  private readonly GQL_FOLDER = `${process.cwd()}/../gql`

  constructor (
    private readonly client: GqlClientService
  ) {}

  async findByEmail (emailPrimary: string) {
    const path = `${this.GQL_FOLDER}/getUserByEmail.gql`

    const users = await this.client.adminQuery(
      path,
      { emailPrimary }
    )

    return isEmpty(users) ? null : users[0]
  }

  async findByAuthId (authServerId: string){
    const path = `${this.GQL_FOLDER}/getUserByAuthId.gql`

    const users = await this.client.adminQuery(
      path,
      { authServerId },
      'no-cache'
    )

    return isEmpty(users) ? null : users[0]
  }

  async createUser (user: UserDTO) {
    const path = `${this.GQL_FOLDER}/registerUser.gql`

    const { returning: users } = await this.client.adminMutate(
      path,
      user
    )

    return isEmpty(users) ? null : users[0]
  }

  // TODO(Reda): Move this to a new module
  async insertAsset (id: number, name: string, assetType: string, privacyType: string) {
    const path = `${this.GQL_FOLDER}/insertAsset.gql`
    const { returning: assets } = await this.client.adminMutate(
      path,
      {
        id: id,
        name: name,
        asset_type: assetType,
        privacy_type: privacyType 
      }
    )

    return isEmpty(assets) ? null : assets[0]
  }

  async updateUserAvatar (id: number, avatarId: number, image: object) {
    const path = `${this.GQL_FOLDER}/updateUserAvatar.gql`

    const { returning: users } = await this.client.adminMutate(
      path,
      {
        id: id,
        avatarId: avatarId,
        image: image
      }
    )

    return isEmpty(users) ? null : users[0]
  }
}
