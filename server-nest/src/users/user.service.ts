import { Injectable } from '@nestjs/common'
import { isEmpty } from 'lodash'
import { resolve } from 'path'

import { GqlClientService } from '../gqlClient/gqlClient.service'
import { UserDTO } from '../dtos/user.dto'

import { GQL_DIR } from '../common/constants'
import { HasuraEventHandler, HasuraEvent } from '@golevelup/nestjs-hasura'
import { SearchService } from '../search/search.service'

@Injectable()
export class UserService {
  constructor (
    private readonly client: GqlClientService,
    private readonly searchService: SearchService
  ) {}

  async findUser (user: UserDTO): Promise<UserDTO> | null {
    if (user.authServerId != null) return await this.findByAuthId(user.authServerId)
    if (user.emailPrimary != null) return await this.findByEmail(user.emailPrimary)

    return null
  }

  async findByEmail (emailPrimary: string): Promise<UserDTO> {
    const users = await this.client.adminQuery(
      resolve(GQL_DIR, 'getUserByEmail.gql'),
      { emailPrimary }
    )

    if (isEmpty(users)) return null

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { __typename, ...user } = users[0]

    return user
  }

  async findByAuthId (authServerId: string): Promise<UserDTO | null> {
    const users = await this.client.adminQuery(
      resolve(GQL_DIR, 'getUserByAuthId.gql'),
      { authServerId },
      'no-cache'
    )

    if (isEmpty(users)) return null

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { __typename, ...user } = users[0]

    return user
  }

  async createUser (user: UserDTO): Promise<UserDTO> {
    const { returning: users } = await this.client.adminMutate(
      resolve(GQL_DIR, 'registerUser.gql'),
      { ...user }
    )

    if (isEmpty(users)) return null

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { __typename, ...newUser } = users[0]

    return newUser
  }

  async updateUserAvatar (id: number, avatarId: number, image: Record<string, unknown>): Promise<UserDTO> {
    const { returning: users } = await this.client.adminMutate(
      resolve(GQL_DIR, 'updateUserAvatar.gql'),
      {
        id: id,
        avatarId: avatarId,
        image: image
      }
    )

    if (isEmpty(users)) return null

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { __typename, ...newUser } = users[0]

    return newUser
  }

  @HasuraEventHandler({
    triggerName: 'users_update'
  })
  async handleUserUpdate (evt: HasuraEvent): Promise<number> {
    try {
      const {
        event: {
          data: { new: newUser }
        }
      } = evt

      const user: UserDTO = new UserDTO(newUser)

      console.log('Hasura Event users update Payload', user.document)

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
  async handleUserInsert (evt: HasuraEvent): Promise<number> {
    try {
      const {
        event: {
          data: { new: newUser }
        }
      } = evt

      const user: UserDTO = new UserDTO(newUser)

      console.log('Hasura Event users create Payload', user.document)

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
