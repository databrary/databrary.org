import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import KcAdminClient from 'keycloak-admin'

@Injectable()
export class KeycloakService {
  private readonly username = this.configService.get('KEYCLOAK_USERNAME')
  private readonly password = this.configService.get('KEYCLOAK_PASSWORD')
  private readonly realm = this.configService.get('KEYCLOAK_REALM')
  private readonly port = this.configService.get('KEYCLOAK_PORT')
  private readonly endpoint = this.configService.get('KEYCLOAK_ENDPOINT')
  private readonly callbackUri = this.configService.get('KEYCLOAK_AUTH_CALLBACK_URL')
  private readonly kcAdminClient = new KcAdminClient({
    baseUrl: `http://${this.endpoint}:${this.port}/auth`,
    realmName: 'master'
  })

  constructor (
    private readonly configService: ConfigService
  ) { }

  get getBaseUri (): string {
    return `http://${this.endpoint}:${this.port}/auth/realms/${this.realm}/protocol/openid-connect`
  }

  get getCallbackUri (): string {
    return this.callbackUri
  }

  async resetUserPassword (id: string, password) {
    try {
      await this.authenticate()

      await this.kcAdminClient.users.resetPassword({
        realm: this.realm,
        id: id,
        credential: {
          temporary: false,
          type: 'password',
          value: password
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  async registerUser (email: string, password: string) {
    try {
      await this.authenticate()

      const user = await this.kcAdminClient.users.create({
        realm: this.realm,
        username: email,
        email: email,
        enabled: true,
        emailVerified: true,
        firstName: 'Test',
        lastName: 'Testerson'
      })

      this.resetUserPassword(user.id, password)
    } catch (error) {
      console.error(error)
    }
  }

  private async authenticate () {
    await this.kcAdminClient.auth({
      username: this.username,
      password: this.password,
      clientId: 'admin-cli',
      grantType: 'password'
    })
  }
}
