import { Controller, Get, UseGuards, Redirect, Request, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeycloakAuthGuard } from '../common/guards/login.guard';
import { KeycloakService } from './keycloak.service'

@Controller('keycloak')
export class KeycloakController {
  constructor(private readonly keycloakService: KeycloakService,
    private configService: ConfigService) {}

  @UseGuards(KeycloakAuthGuard)
  @Get('login')
  @Redirect('/')
  async login() {
    return;
  }

  @UseGuards(KeycloakAuthGuard)
  @Get('auth/callback')
  @Redirect('/')
  async callback() {
    return;
  }

  @Get('logout')
  async logout(@Request() req, @Res() res) {
    const realm = this.configService.get('KEYCLOAK_REALM');
    const port = this.configService.get('KEYCLOAK_PORT');
    const endpoint = this.configService.get('KEYCLOAK_ENDPOINT');

    const url = `http://${endpoint}:${port}/auth/realms/${realm}/protocol/openid-connect/logout?redirect_uri=http://localhost:8000`;
    req.logout();
    res.redirect(url);
  }
}