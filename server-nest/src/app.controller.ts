import {
  Controller,
  Get,
  UseGuards,
  Session,
  Redirect,
  Res,
  Request,
  ClassSerializerInterceptor,
  UseInterceptors,
  Post
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { UserDTO } from './dtos/user.dto'

import { isEmpty } from 'lodash'
import { UserService } from './users/user.service'
import { SearchService } from './search/search.service'

@Controller()
export class AppController {
  constructor (
    private readonly userService: UserService,
    private readonly searchService: SearchService
  ) {}

  @Get('/')
  @Redirect('http://127.0.0.1:8000/')
  home (): void {
    // do nothing.
  }

  @UseGuards(AuthGuard('keycloak'))
  @Get('login')
  login (): void {
    // do nothing.
  }

  @Get('register')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  register (@Res() res, @Session() { user }: { user: UserDTO }): any {
    return isEmpty(user)
      ? res.redirect('/keycloak/register')
      : res.redirect('/')
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('session')
  async session (@Session() { user }: { user: UserDTO }): Promise<UserDTO | null> {
    if (isEmpty(user)) return null

    const dbUser = await this.userService.findUser(user)

    return dbUser
  }

  @Post('search')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async search (@Request() req, @Res() res): Promise<any> {
    try {
      const { search } = req.body

      if (isEmpty(search)) return res.json([])

      const result = await this.searchService.searchAll(search)

      return res.json(result)
    } catch (error) {
      console.error('error')
    }

    res.json([])
  }

  @Get('logout')
  @Redirect('/keycloak/logout')
  logout (): void {
    // do nothing.
  }
}
