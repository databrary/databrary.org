import { Module } from '@nestjs/common'
import { KeycloakModule } from 'src/keycloak/keycloak.module'
import { UserModule } from '../users/user.module'
import { IngestController } from './ingest.controller'
import { IngestService } from './ingest.service'

@Module({
  imports: [KeycloakModule, UserModule],
  controllers: [IngestController],
  providers: [IngestService]
})
export class IngestModule {}
