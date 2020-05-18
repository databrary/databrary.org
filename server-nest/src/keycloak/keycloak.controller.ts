import { Controller, Get, UseGuards, Redirect, Request, Res, Session} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeycloakService } from './keycloak.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('keycloak')
export class KeycloakController {
  constructor(private readonly keycloakService: KeycloakService,
    private configService: ConfigService) {}

  @UseGuards(AuthGuard('keycloak'))
  @Get('auth')
  @Redirect('/')
  async auth() {
    return;
  }

  @UseGuards(AuthGuard('keycloak'))
  @Get('auth/callback')
  @Redirect('/')
  async callback(@Request() req, @Session() session) {
    session.user = req.user
  }

  @Get('logout')
  async logout(@Request() req, @Res() res, @Session() session) {
    const realm = this.configService.get('KEYCLOAK_REALM');
    const port = this.configService.get('KEYCLOAK_PORT');
    const endpoint = this.configService.get('KEYCLOAK_ENDPOINT');

    session.user = {}

    const url = `http://${endpoint}:${port}/auth/realms/${realm}/protocol/openid-connect/logout?redirect_uri=http://localhost:8000`;
    req.logout();
    res.redirect(url);
  }
}