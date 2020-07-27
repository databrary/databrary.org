import { Test } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { UserService } from './user.service'
import { GqlClientService } from '../gqlClient/gqlClient.service'
import { SearchModule } from '../search/search.module'
import { polly } from '../../test/recorderExample'

// TODO(Reda): Create a user
describe(' UserService', () => {
  let userService: UserService

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
      expect(await userService.findByAuthId('ABCDE')).toBeNull()
      expect(await userService.findByAuthId('5f1524fe-0dac-4897-810a-e05aa7e36671')).toBeDefined()
    })
    // it('Should return null', () => {})
  })
})
