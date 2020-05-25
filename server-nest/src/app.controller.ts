import { Controller, Get, UseGuards, Session, Redirect, Res, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { UserDTO } from './dtos/user.dto'

import { isEmpty } from 'lodash'

@Controller()
export class AppController {
  constructor () {}

  @Get('/')
  @Redirect('https://localhost/')
  async home () {

  }

  @UseGuards(AuthGuard('keycloak'))
  @Get('login')
  async login () {

  }

  @Get('register')
  async register (@Res() res, @Session() { user }) {
    return isEmpty(user) ? res.redirect('/keycloak/register') : res.redirect('/')
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('session')
  session (@Session() { user }): UserDTO {
    return new UserDTO(user)
  }

  @Get('logout')
  @Redirect('/keycloak/logout')
  logout () {

  }
}
