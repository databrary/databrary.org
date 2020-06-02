import {
  Controller,
  Get,
  UseGuards,
  Redirect,
  Request,
  Res,
  Session
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { v4 as uuidv4 } from 'uuid'
import { KeycloakService } from './keycloak.service'

@Controller('keycloak')
export class KeycloakController {
  constructor(private readonly keycloakService: KeycloakService) {}

  @UseGuards(AuthGuard('keycloak'))
  @Get('auth')
  @Redirect('/')
  async auth() {
    // do nothing.
  }

  @Get('register')
  async register(@Res() res) {
    const url = `${
      this.keycloakService.getBaseUri
    }/registrations?client_id=client&state=${uuidv4()}response_mode=fragment&response_type=code&redirect_uri=${
      this.keycloakService.getCallbackUri
    }`
    res.redirect(url)
  }

  @UseGuards(AuthGuard('keycloak'))
  @Get('auth/callback')
  @Redirect('/')
  async callback(@Request() req, @Session() session) {
    session.user = req.user
  }

  @Get('logout')
  async logout(@Request() req, @Res() res, @Session() session) {
    session.user = {}

    const url = `${this.keycloakService.getBaseUri}/logout?redirect_uri=http://localhost:8000`
    req.logout()
    res.redirect(url)
  }
}
