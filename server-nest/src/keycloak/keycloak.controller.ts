import { Controller, Get, Request, UseGuards, Redirect } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Controller('keycloak')
export class KeycloakController {
  @UseGuards(AuthGuard('keycloak'))
  @Get('auth')
  async auth(@Request() req) {
    return 1
  }

  @UseGuards(AuthGuard('keycloak'))
  @Get('auth/callback')
  async callback(@Request() req) {
    return 2
  }

  @UseGuards(AuthGuard('keycloak'))
  @Get('login') // Need to put this in app
  @Redirect('/')
  async login() {}
}