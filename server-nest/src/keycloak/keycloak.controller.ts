import { Controller, Get, Request, UseGuards, Session, Redirect } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Controller('keycloak')
export class KeycloakController {

  @UseGuards(AuthGuard('keycloak'))
  @Get('auth/callback')
  @Redirect('/session')
  async callback(@Request() req) {
    req.login(req.user, (err) => {
      if (err) { return null; }
      return req.user;
    });
  }
}