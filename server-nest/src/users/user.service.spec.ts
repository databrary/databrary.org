import { Test } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { UserService } from './user.service'
import { GqlClientService } from '../gqlClient/gqlClient.service'
import { SearchModule } from '../search/search.module'
import { Polly } from '@pollyjs/core'
import { setupPolly } from 'setup-polly-jest'

import FSPersister from '@pollyjs/persister-fs'
import NodeHttpAdapter from '@pollyjs/adapter-node-http'

import { UserDTO } from '../dtos/user.dto'
import { ImageKey } from '../common/types'

Polly.register(NodeHttpAdapter)
Polly.register(FSPersister)

describe(' UserService', () => {
  setupPolly({
    adapters: ['node-http'],
    persister: 'fs',
    recordIfMissing: true,
    persisterOptions: {
      fs: {
        recordingsDir: './recordings'
      }
    }
  })

  let userService: UserService

  const user: UserDTO = new UserDTO({
    authServerId: '5dcda08d-4aac-47ff-9131-71505fbf8fb6',
    emailPrimary: 'testerson@dev.com',
    givenName: 'Testerson',
    familyName: 'Test'
  })

  let fakeUser = null

  const USER_ID = 1
  const USER_AVATAR_ID = 1

  const USER_IMAGE: Record<ImageKey, string> = {
    thumbnail: 'minio/url/to/public/thumbnail',
    large: 'minio/url/to/public/large'
  }

  beforeAll(async () => {
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

  beforeEach(() => {
    fakeUser = Object.assign({}, user)
  })

  describe('createUser', () => {
    it('Should return a new User object with an id', async () => {
      const newUser = await userService.createUser(fakeUser)

      expect(newUser).toBeInstanceOf(UserDTO)
      expect(newUser.id).toBe(1)
    })

    it('Should throw an Error when user is null', async () => {
      await expect(userService.createUser(null)).rejects.toThrow()
    })

    it('Should throw an Error when user authServerId exists in db', async () => {
      // We keep authServerId to make sure that it is set up as unique in the DB
      // IMPORTANT: Do not change this line otherwise pollyJS will throw an error
      fakeUser.emailPrimary = 'fake@dev.com'
      await expect(userService.createUser(fakeUser)).rejects.toThrow()
    })

    it('Should throw an Error when user emailPrimary exists in db', async () => {
      // We keep emailPrimary to make sure that it is set up as unique in the DB
      // IMPORTANT: Do not change this line otherzise pollyJS will throw an error
      fakeUser.authServerId = 'auth-server-id-fake-user'
      await expect(userService.createUser(fakeUser)).rejects.toThrow()
    })
  })

  describe('findByAuthId', () => {
    it('Should return a user object', async () => {
      expect(await userService.findByAuthId(fakeUser.authServerId)).toBeInstanceOf(UserDTO)
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
      expect(await userService.findByEmail(fakeUser.emailPrimary)).toBeInstanceOf(UserDTO)
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
    it('Should return a user object', async () => {
      expect(await userService.findUser(fakeUser)).toBeInstanceOf(UserDTO)
    })

    it('Should return a user object when authServerId is null', async () => {
      fakeUser.authServerId = null
      expect(await userService.findUser(fakeUser)).toBeInstanceOf(UserDTO)
    })

    it('Should return a user object when emailPrimary is null', async () => {
      fakeUser.emailPrimary = null
      expect(await userService.findUser(fakeUser)).toBeInstanceOf(UserDTO)
    })

    it('Should return null', async () => {
      fakeUser.emailPrimary = null
      fakeUser.authServerId = null
      expect(await userService.findUser(fakeUser)).toBeNull()
      expect(await userService.findUser(undefined)).toBeNull()
    })
  })

  describe('updateUserAvatar', () => {
    it('Should update the user avatarId and images and return true', async () => {
      expect(await userService.updateUserAvatar(USER_ID, USER_AVATAR_ID, USER_IMAGE)).toBeTruthy()
    })

    it('Should throw an Error when updateUserAvatar args are null', async () => {
      await expect(userService.updateUserAvatar(null, USER_AVATAR_ID, USER_IMAGE)).rejects.toThrow()
      await expect(userService.updateUserAvatar(null, null, USER_IMAGE)).rejects.toThrow()
      await expect(userService.updateUserAvatar(null, null, null)).rejects.toThrow()
    })
  })
})
