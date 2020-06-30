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
  @Redirect('https://localhost/')
  home () {
    // do nothing.
  }

  @UseGuards(AuthGuard('keycloak'))
  @Get('login')
  login () {
    // do nothing.
  }

  @Get('register')
  async register (@Res() res, @Session() { user }) {
    return isEmpty(user)
      ? res.redirect('/keycloak/register')
      : res.redirect('/')
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('session')
  async session (@Session() { user }): Promise<UserDTO> {
    if (isEmpty(user)) return new UserDTO(user)

    const dbUser = await this.userService.findUser(user as UserDTO)

    return new UserDTO(dbUser)
  }

  @Post('search')
  async search (@Request() req, @Res() res) {
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
  logout () {
    // do nothing.
  }
}
