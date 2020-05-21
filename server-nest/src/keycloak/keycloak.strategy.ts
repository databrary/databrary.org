import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject } from '@nestjs/common';

import { Strategy } from 'passport-keycloak-oauth2-oidc';

import { UserService } from 'src/users/user.service';
import { UserDTO } from 'src/dtos/user.dto';

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  constructor(
    @Inject('KEYCLOAK_STRATEGY_CONFIG') config: any,
    private readonly userService: UserService
  ) {
    super(config)
  }
  // TODO(Reda): Check if user is valid before returning the profile
  async validate(accessToken, refreshToken, profile, done): Promise<any> {
    try {
      let user = await this.userService.findByAuthId(profile.id);

      if (!user) {
        const { 
          id: authServerId, 
          email: emailPrimary, 
          _json: { 
            given_name: givenName, 
            family_name: familyName 
          }
        } = profile;

        user = await this.userService.createUser(new UserDTO({
          authServerId,
          emailPrimary,
          givenName,
          familyName,
        }));
      }

      const { __typename, ...dbUser} = user;

      return dbUser;
    } catch (error) {
      return false;
    }
  }
}