import { Strategy } from 'passport-keycloak-oauth2-oidc'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common'

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  constructor(@Inject('KEYCLOAK_STRATEGY_CONFIG') config: any ) {
    super(config)
  }

  async validate(accessToken, refreshToken, profile, done): Promise<any> {
    console.log(profile)
    // const user = await this.authService.validateUser(username, password);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    return profile;
  }
}