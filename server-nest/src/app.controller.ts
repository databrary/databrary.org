import { Controller, Get, UseGuards, Session, Redirect, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { isEmpty } from 'lodash';

@Controller()
export class AppController {
  constructor() {}

  @UseGuards(AuthGuard('keycloak'))
  @Get('login')
  @Redirect('/')
  async login() {
    return;
  }

  @Get('register')
  async register(@Res() res, @Session() { session: { user }}) {
    if (!isEmpty(user)) return res.redirect('/');
    res.redirect('/keycloak/register');
  }

  @Get('session')
  session(@Session() { session: { user }}) {
    return user;
  }

  @Get('logout')
  @Redirect('/keycloak/logout')
  logout() {
    return;
  }
}
