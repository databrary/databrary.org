import { Controller, Get, Request, UseGuards, Session, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @UseGuards(AuthGuard('keycloak'))
  @Get('login')
  @Redirect('/')
  async login() {
  }

  // @UseGuards(AuthenticatedGuard)
  @Get('session')
  session(@Session() session) {
    return session
  }

  @Get('logout')
  @Redirect('/keycloak/logout')
  logout() {
    return;
  }
}
