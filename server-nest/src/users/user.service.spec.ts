import { Test } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { UserService } from './user.service'
import { GqlClientService } from '../gqlClient/gqlClient.service'
import { SearchModule } from '../search/search.module'
import { polly } from '../../test/recorderExample'
import { UserDTO } from '../dtos/user.dto'
import { ImageKey } from 'src/common/types'

// If a new recording is needed, you must create a new user with TEST_AUTH_SERVER_ID and TEST_EMAIL_PRIMARY
// and an asset of type avatar.
// IMPORTANT: new user and asset need to have an id = 1
describe(' UserService', () => {
  let userService: UserService
  // This authServerId and emailPrimary listed bellow are available in the PollyJs recording
  // DO NOT EDIT THEM UNLESS YOU ARE CREATING A NEW RECORDING
  const TEST_AUTH_SERVER_ID = '5dcda08d-4aac-47ff-9131-71505fbf8fb6'
  const TEST_EMAIL_PRIMARY = 'testerson@dev.com'
  // TODO: Remove Faker
  const TEST_USER_ID = 1
  const TEST_USER_AVATAR_ID = 1

  const fakeUser = new UserDTO({
    authServerId: 'auth-server-id-fake-user',
    emailPrimary: 'fake@dev.com',
    givenName: 'Testerson',
    familyName: 'Test'
  })

  const fakeImage: Record<ImageKey, string> = {
    thumbnail: 'minio/url/to/public/thumbnail',
    large: 'minio/url/to/public/large'
  }

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
      const newUser = await userService.createUser(fakeUser)

      expect(newUser).toBeInstanceOf(UserDTO)
      expect(newUser.id).toBeDefined()
    })

    it('Should throw an Error when user is null', async () => {
      await expect(userService.createUser(null)).rejects.toThrow()
    })

    it('Should throw an Error when user authServerId exists in db', async () => {
      // We keep authServerId to make sure that it is set up as unique in the DB
      // IMPORTANT: Do not change this line otherzise pollyJS will throw an error
      fakeUser.emailPrimary = 'anotherfake@dev.com'
      await expect(userService.createUser(fakeUser)).rejects.toThrow()
    })

    it('Should throw an Error when user emailPrimary exists in db', async () => {
      // We keep emailPrimary to make sure that it is set up as unique in the DB
      // IMPORTANT: Do not change this line otherzise pollyJS will throw an error
      fakeUser.authServerId = 'another-auth-server-id-fake-user'
      await expect(userService.createUser(fakeUser)).rejects.toThrow()
    })
  })

  describe('updateUserAvatar', () => {
    it('Should update the user avatarId and images and return true', async () => {
      expect(await userService.updateUserAvatar(TEST_USER_ID, TEST_USER_AVATAR_ID, fakeImage)).toBeTruthy()
    })

    it('Should throw an Error when updateUserAvatar args are null', async () => {
      await expect(userService.updateUserAvatar(null, TEST_USER_AVATAR_ID, fakeImage)).rejects.toThrow()
      await expect(userService.updateUserAvatar(null, null, fakeImage)).rejects.toThrow()
      await expect(userService.updateUserAvatar(null, null, null)).rejects.toThrow()
    })
  })
})
