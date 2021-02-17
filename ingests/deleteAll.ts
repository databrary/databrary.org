import _ from 'lodash'
import Knex from 'knex'
import pMap from 'p-map'
import {promises as fs} from 'fs'

import { bootstrap } from '../server/dist/sdk'
import { KeycloakService } from '../server/dist/keycloak/keycloak.service'
import { UserService } from '../server/dist/users/user.service'
import { UserDTO } from '../server/dist/dtos/user.dto'

async function main () {
  const app = await bootstrap()
  const keycloakService = app.get(KeycloakService)
  const userService = app.get(UserService)

  const knex = Knex({
    client: 'pg',
    connection: {
      host : 'localhost',
      port: 5432,
      user : 'postgres',
      password : 'postgres',
      database : 'postgres'
    }
  })

  await pMap([
    'fileobjects', 'files', 'assets',
    'groups_admins', 'groups_users', 'groups',
    'permissionsets', 'permissions', 'users'
  ], 
  async (table) => {
    await knex(table).del()
  })

  await pMap([{
    id: 1000,
    givenName: 'Jeffrey',
    familyName: 'Spies',
    emailPrimary: 'jspies@gmail.com',
    authServerId: null
  }], async newUser => {
    console.log(await keycloakService.getUser(newUser.emailPrimary))

    newUser.authServerId = await keycloakService.registerUser(
      newUser.emailPrimary,
      newUser.givenName,
      newUser.familyName
    )

    if (!newUser.authServerId) {
      return false
    }

    const userDTO: UserDTO = new UserDTO(newUser)
    try {
      await userService.createUser(userDTO)
      return true
    } catch (error) {
      console.log(`Error when adding ${newUser.emailPrimary} (${newUser.authServerId}): ${error.message}`)
      return false
    }
  })

  await knex.destroy()
  await app.close()
}

main()