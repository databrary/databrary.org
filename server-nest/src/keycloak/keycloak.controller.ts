import { Controller, Get, UseGuards, Redirect, Request, Res, Session } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { v4 as uuidv4 } from 'uuid';

@Controller('keycloak')
export class KeycloakController {
  private readonly realm = this.configService.get('KEYCLOAK_REALM');
  private readonly port = this.configService.get('KEYCLOAK_PORT');
  private readonly endpoint = this.configService.get('KEYCLOAK_ENDPOINT');

  constructor(
    private readonly configService: ConfigService
  ) {}

  @UseGuards(AuthGuard('keycloak'))
  @Get('auth')
  @Redirect('/')
  async auth() {
    return;
  }

  @Get('register')
  async register(@Res() res) {
    const callbackUri = this.configService.get('KEYCLOAK_AUTH_CALLBACK_URL');
    const url = `http://${this.endpoint}:${this.port}/auth/realms/${this.realm}/protocol/openid-connect/registrations?client_id=client&state=${uuidv4()}response_mode=fragment&response_type=code&redirect_uri=${callbackUri}`;
    res.redirect(url);
  }
  

  @UseGuards(AuthGuard('keycloak'))
  @Get('auth/callback')
  @Redirect('/')
  async callback(@Request() req, @Session() session) {
    session.user = req.user;
  }

  @Get('logout')
  async logout(@Request() req, @Res() res, @Session() session) {
    session.user = {};

    const url = `http://${this.endpoint}:${this.port}/auth/realms/${this.realm}/protocol/openid-connect/logout?redirect_uri=http://localhost:8000`;
    req.logout();
    res.redirect(url);
  }
}