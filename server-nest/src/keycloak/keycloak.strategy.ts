import { PassportStrategy } from '@nestjs/passport'
import { Injectable, Inject } from '@nestjs/common'

import { Strategy } from 'passport-keycloak-oauth2-oidc'

import { UserService } from '../users/user.service'
import { UserDTO } from '../dtos/user.dto'

@Injectable()
export class KeycloakStrategy extends PassportStrategy(Strategy, 'keycloak') {
  constructor (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @Inject('KEYCLOAK_STRATEGY_CONFIG') config: any,
    private readonly userService: UserService
  ) {
    super(config)
  }

  // TODO(Reda): Check if user is valid before returning the profile
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async validate (accessToken, refreshToken, profile, done): Promise<any> {
    try {
      const {
        id: authServerId,
        email: emailPrimary,
        _json: { given_name: givenName, family_name: familyName }
      } = profile

      const userDTO: UserDTO = new UserDTO({
        authServerId,
        emailPrimary,
        givenName,
        familyName
      })

      let user = await this.userService.findUser(userDTO)

      if (user == null) {
        user = await this.userService.createUser(userDTO)
      }

      if (user == null) return false

      return user
    } catch (error) {
      return false
    }
  }
}
