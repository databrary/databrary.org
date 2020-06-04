import { Injectable } from '@nestjs/common'
import { isEmpty } from 'lodash'
import { resolve } from 'path'

import { GqlClientService } from 'src/gqlClient/gqlClient.service'
import { UserDTO } from 'src/dtos/user.dto'

import { GQL_DIR } from 'src/common/constants'
import { HasuraEventHandler, HasuraEvent } from '@golevelup/nestjs-hasura'
import { SearchService } from 'src/search/search.service'

@Injectable()
export class UserService {
  constructor(
    private readonly client: GqlClientService,
    private readonly searchService: SearchService
  ) {}

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

  @HasuraEventHandler({
    triggerName: 'users_update'
  })
  async handleUserUpdate(evt: HasuraEvent) {
    try {
      const {
        event: {
          data: { new: newUser }
        }
      } = evt

      const user: UserDTO = new UserDTO(newUser)

      console.log(`Hasura Event users update Payload`, user.document)

      const status = await this.searchService.update(
        user.id.toString(),
        'databrary-users',
        user.document
      )

      return status
    } catch (error) {
      throw new Error(error.message)
    }
  }

  @HasuraEventHandler({
    triggerName: 'users_insert'
  })
  async handleUserInsert(evt: HasuraEvent) {
    try {
      const {
        event: {
          data: { new: newUser }
        }
      } = evt

      const user: UserDTO = new UserDTO(newUser)

      console.log(`Hasura Event users create Payload`, user.document)

      const status = await this.searchService.create(
        user.id.toString(),
        'databrary-users',
        user.document
      )

      return status
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
