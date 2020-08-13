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

  async findUser (user: UserDTO): Promise<UserDTO | null> {
    if (user == null) return null
    if (user.authServerId != null) return await this.findByAuthId(user.authServerId)
    if (user.emailPrimary != null) return await this.findByEmail(user.emailPrimary)

    return null
  }

  async findByEmail (emailPrimary: string): Promise<UserDTO | null> {
    if (emailPrimary == null) return null
    // TODO: Fix emailPrimary permission https://github.com/apollographql/apollo-client/issues/5080
    const users = await this.client.adminQuery(
      resolve(GQL_DIR, 'getUserByEmail.gql'),
      { emailPrimary },
      'no-cache'
    )

    if (isEmpty(users)) return null

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { __typename, ...user } = users[0]

    return new UserDTO(user)
  }

  async findByAuthId (authServerId: string): Promise<UserDTO | null> {
    if (authServerId == null) return null

    const users = await this.client.adminQuery(
      resolve(GQL_DIR, 'getUserByAuthId.gql'),
      { authServerId },
      'no-cache'
    )

    if (isEmpty(users)) return null

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { __typename, ...user } = users[0]

    return new UserDTO(user)
  }

  async createUser (user: UserDTO): Promise<UserDTO | null> {
    if (user == null) throw new Error('User Cannot be null')

    const { returning: users } = await this.client.adminMutate(
      resolve(GQL_DIR, 'registerUser.gql'),
      { ...user }
    )

    if (isEmpty(users)) throw new Error('Register user mutation must return a full user object')

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { __typename, ...newUser } = users[0]

    return new UserDTO(newUser)
  }

  async updateUserAvatar (id: number, avatarId: number, image: Record<string, unknown>): Promise<boolean> {
    if (id == null || avatarId == null || image == null) throw new Error('Must provide an id, avatarId and an image to update a user avatar')

    const { returning: users } = await this.client.adminMutate(
      resolve(GQL_DIR, 'updateUserAvatar.gql'),
      {
        id: id,
        avatarId: avatarId,
        image: image
      }
    )

    if (isEmpty(users)) return false

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { __typename, ...user } = users[0]

    return user.id != null
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

      // console.log('Hasura Event users create Payload', user.document)

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
