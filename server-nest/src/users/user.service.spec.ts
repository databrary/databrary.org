import { Test } from '@nestjs/testing'
import { UserService } from './user.service'
import { GqlClientService } from '../gqlClient/gqlClient.service'

describe(' UserService', () => {
  let userService: UserService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: GqlClientService,
          useFactory: () => ({
            adminQuery: jest.fn(() => ({
              name: 'Reda'
            })),
            adminMutate: jest.fn()
          })
        }
      ]
    }).compile()

    userService = module.get<UserService>(UserService)
    // client = module.get<GqlClientService>(GqlClientService)
  })

  it('should be defined', () => {
    expect(userService).toBeDefined()
  })

  describe('findByAuthId', () => {
    it('Should return a user object', () => {
      //   expect(userService.findByAuthId('ABCDE')).toEqual({})
      const user = userService.findByAuthId('ABCDE')
      console.log(user)
    })
    // it('Should return null', () => {})
  })
})
