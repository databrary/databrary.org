import { Module } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { KeycloakController } from './keycloak.controller';
import { KeycloakStrategy } from './keycloak.strategy';
import { KeycloakSerializer } from './keycloak.serializer';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport'

const keycloakStrategyConfig = {
  provide: 'KEYCLOAK_STRATEGY_CONFIG',
  useFactory: (config: ConfigService) => ({
    clientID: config.get('KEYCLOAK_CLIENT_ID'),
    realm: config.get('KEYCLOAK_REALM'),
    publicClient: 'false',
    clientSecret: config.get('KEYCLOAK_CLIENT_SECRET'),
    sslRequired: 'none',
    authServerURL: config.get('KEYCLOAK_SERVER_URL'),
    callbackURL: config.get('KEYCLOAK_AUTH_CALLBACK_URL')
  }),
  inject: [ConfigService]
}

@Module({
  imports: [PassportModule],
  providers: [
    KeycloakService,
    KeycloakStrategy,
    KeycloakSerializer,
    keycloakStrategyConfig
  ],
  controllers: [KeycloakController]
})
export class KeycloakModule {}