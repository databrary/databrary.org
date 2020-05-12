import { Module, Injectable } from '@nestjs/common';
import { KeycloakService } from './keycloak.service';
import { KeycloakController } from './keycloak.controller';
import { KeycloakStrategy } from './keycloak.strategy'
import { ConfigService } from '@nestjs/config';


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
  providers: [
    KeycloakService,
    KeycloakStrategy,
    keycloakStrategyConfig
  ],
  controllers: [KeycloakController]
})
export class KeycloakModule {}