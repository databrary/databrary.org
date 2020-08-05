import { Test } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { UserService } from './user.service'
import { GqlClientService } from '../gqlClient/gqlClient.service'
import { SearchModule } from '../search/search.module'
import { polly } from '../../test/recorderExample'
import { UserDTO } from '../dtos/user.dto'
import { ImageKey } from 'src/common/types'

describe(' UserService', () => {
  let userService: UserService
  const TEST_USER_ID = 1
  const TEST_USER_AVATAR_ID = 1
  const TEST_AUTH_SERVER_ID = '5dcda08d-4aac-47ff-9131-71505fbf8fb6'
  const TEST_EMAIL_PRIMARY = 'testerson@dev.com'
  const TEST_NEW_AUTH_SERVER_ID = 'new-auth-test-server-id'
  const TEST_NEW_EMAIL_PRIMARY = 'testerson2@dev.com'

  afterAll(async () => {
    await polly.stop()
  })

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: ['../.env'],
          isGlobal: true
        }),
        SearchModule
      ],
      providers: [
        UserService,
        GqlClientService
      ]
    }).compile()

    userService = moduleRef.get<UserService>(UserService)
  })

  describe('findByAuthId', () => {
    it('Should return a user object', async () => {
      expect(await userService.findByAuthId(TEST_AUTH_SERVER_ID)).toBeInstanceOf(UserDTO)
    })

    it('Should return null', async () => {
      expect(await userService.findByAuthId('ddc724d4-c23b-4c1e-829d-66f5276dc25')).toBeNull()
      expect(await userService.findByAuthId('ABCDE')).toBeNull()
      expect(await userService.findByAuthId('')).toBeNull()
      expect(await userService.findByAuthId(null)).toBeNull()
      expect(await userService.findByAuthId(undefined)).toBeNull()
    })
  })

  describe('findByEmail', () => {
    it('Should return a user object', async () => {
      expect(await userService.findByEmail(TEST_EMAIL_PRIMARY)).toBeInstanceOf(UserDTO)
    })

    it('Should return null', async () => {
      expect(await userService.findByEmail('testerson@dev.co')).toBeNull()
      expect(await userService.findByEmail('null@null.org')).toBeNull()
      expect(await userService.findByEmail('')).toBeNull()
      expect(await userService.findByEmail(null)).toBeNull()
      expect(await userService.findByEmail(undefined)).toBeNull()
    })
  })

  describe('findUser', () => {
    it('Should return a user object when authServerId is null', async () => {
      const user = new UserDTO({
        emailPrimary: TEST_EMAIL_PRIMARY
      })
      expect(await userService.findUser(user)).toBeInstanceOf(UserDTO)
    })

    it('Should return a user object when emailPrimary is null', async () => {
      const user = new UserDTO({
        authServerId: TEST_AUTH_SERVER_ID
      })
      expect(await userService.findUser(user)).toBeInstanceOf(UserDTO)
    })

    it('Should return a user object', async () => {
      const user = new UserDTO({
        emailPrimary: TEST_EMAIL_PRIMARY,
        authServerId: TEST_AUTH_SERVER_ID
      })
      expect(await userService.findUser(user)).toBeInstanceOf(UserDTO)
    })

    it('Should return null', async () => {
      let user = new UserDTO({
        emailPrimary: null,
        authServerId: null
      })
      expect(await userService.findUser(user)).toBeNull()

      user = undefined
      expect(await userService.findUser(user)).toBeNull()
    })
  })

  describe('createUser', () => {
    it('Should return a new User object with an id', async () => {
      const user = new UserDTO({
        authServerId: TEST_NEW_AUTH_SERVER_ID,
        emailPrimary: TEST_NEW_EMAIL_PRIMARY,
        givenName: 'Testerson 2',
        familyName: 'Test'
      })

      const newUser = await userService.createUser(user)

      expect(newUser).toBeInstanceOf(UserDTO)
      expect(newUser.id).toBeDefined()
    })

    it('Should throw an Error when user is null', async () => {
      await expect(userService.createUser(null)).rejects.toThrow()
    })

    it('Should throw an Error when user authServerId exists in db', async () => {
      const user = new UserDTO({
        authServerId: TEST_AUTH_SERVER_ID,
        emailPrimary: TEST_NEW_EMAIL_PRIMARY,
        givenName: 'Testerson 2',
        familyName: 'Test'
      })
      await expect(userService.createUser(user)).rejects.toThrow()
    })

    it('Should throw an Error when user emailPrimary exists in db', async () => {
      const user = new UserDTO({
        authServerId: TEST_NEW_AUTH_SERVER_ID,
        emailPrimary: TEST_EMAIL_PRIMARY,
        givenName: 'Testerson 2',
        familyName: 'Test'
      })
      await expect(userService.createUser(user)).rejects.toThrow()
    })
  })

  // WIP: Foreign key violation. insert or update on table "users" violates foreign key constraint "users_avatarId_fkey"
  describe('updateUserAvatar', () => {
    it('Should update the user avatarId and images and return true', async () => {
      const image: Record<ImageKey, string> = {
        thumbnail: 'url/to/thumbnail',
        large: 'url/to/large'
      }
      expect(await userService.updateUserAvatar(TEST_USER_ID, TEST_USER_AVATAR_ID, image)).toBeTruthy()
    })

    it('Should throw an Error when updateUserAvatar args are null', async () => {
      const image: Record<ImageKey, string> = {
        thumbnail: 'url/to/thumbnail',
        large: 'url/to/large'
      }
      await expect(userService.updateUserAvatar(null, TEST_USER_AVATAR_ID, image)).rejects.toThrow()
      await expect(userService.updateUserAvatar(null, null, image)).rejects.toThrow()
      await expect(userService.updateUserAvatar(null, null, null)).rejects.toThrow()
    })
  })
})
