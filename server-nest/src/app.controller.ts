import { Controller, Get, Request, UseGuards, Session, Redirect } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';
import { KeycloakAuthGuard } from './common/guards/login.guard'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  getHello(@Request() req, @Session() sess ) {
    return { sess, passport: req.user } // Testing session 
  }

  @UseGuards(KeycloakAuthGuard)
  @Get('login')
  async login(@Request() req) {
    return req.user; // Testing user
  }

  @UseGuards(AuthenticatedGuard)
  @Get('session')
  session(@Request() req) {
    return req.user;
  }

  @Get('logout')
  @Redirect('/keycloak/logout')
  logout() {
    return;
  }
}
