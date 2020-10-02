import { Injectable } from '@nestjs/common'
import { KeycloakService } from '../keycloak/keycloak.service'
import { UserService } from '../users/user.service'
import { UserDTO } from '../dtos/user.dto'

@Injectable()
export class IngestService {
  constructor (
    private readonly keycloakService: KeycloakService,
    private readonly userService: UserService
  ) {}

  async ingestUsers (users: Array<Record<string, string>>): Promise<boolean> {
    // "givenName": "Karen",
    // "familyName": "Adolph",
    // "displayFullName": "Karen Adolph",
    // "emailPrimary": "karen.adolph@nyu.edu",
    // "authServerId": "7768e08c-d75a-4771-877f-8d26a842c773"
    for (const user of users) {
      console.log('Inegst user', user)

      const { givenName, familyName, displayFullName, emailPrimary } = user
      if (emailPrimary == null) continue
      try {
        // register a keycloak user
        const authServerId = await this.keycloakService.registerUser(emailPrimary, givenName, familyName)

        // register to hasura
        const userDTO: UserDTO = new UserDTO({
          authServerId,
          emailPrimary,
          givenName,
          displayFullName,
          familyName
        })

        let userDb = await this.userService.findUser(userDTO)

        if (userDb != null) continue

        userDb = await this.userService.createUser(userDTO)
      } catch (error) {
        console.log('Error during user ingest', error.message)
      }
    }
    return true
  }
}
