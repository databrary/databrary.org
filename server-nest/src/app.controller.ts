import {
  Controller,
  Get,
  UseGuards,
  Session,
  Redirect,
  Res,
  ClassSerializerInterceptor,
  UseInterceptors
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { UserDTO } from './dtos/user.dto'

import { isEmpty } from 'lodash'
import { UserService } from './users/user.service'

@Controller()
export class AppController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @Redirect('https://localhost/')
  home() {
    // do nothing.
  }

  @UseGuards(AuthGuard('keycloak'))
  @Get('login')
  login() {
    // do nothing.
  }

  @Get('register')
  async register(@Res() res, @Session() { user }) {
    return isEmpty(user)
      ? res.redirect('/keycloak/register')
      : res.redirect('/')
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('session')
  async session(@Session() { user }): Promise<UserDTO> {
    if (isEmpty(user)) return new UserDTO(user)

    const { __typename, ...dbUser } = await this.userService.findByAuthId(
      user.authServerId
    )

    return new UserDTO(dbUser)
  }

  @Get('logout')
  @Redirect('/keycloak/logout')
  logout() {
    // do nothing.
  }
}
