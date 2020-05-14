import { Controller, Get, Post, Request, UseGuards, Session, Redirect } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';
import { AuthenticatedGuard } from './common/guards/authenticated.guard';

import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Request() req, @Session() sess ) {
    // return this.appService.getHello();
    return sess
  }

  @UseGuards(AuthGuard('keycloak'))
  @Get('login') // Need to put this in app
  async login(@Request() req) {
    console.log(`Login`);
    console.log(`User ${JSON.stringify(req.user)}`);
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('session')
  session(@Request() req,  @Session() sess) {
    console.log(`session`);
    console.log(`User ${JSON.stringify(req.user)}`);
    return req.user;
  }

  @Get('logout')
  logout(@Request() req) {
    console.log(`Logout`);
    console.log(`User ${JSON.stringify(req.user)}`);
    req.logout();
    return 'Logout';
  }
}
