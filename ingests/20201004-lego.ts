import _ from 'lodash'
import Knex from 'knex'
import pMap from 'p-map'
import {promises as fs} from 'fs'

import { bootstrap } from '../server-nest/dist/sdk'
import { KeycloakService } from '../server-nest/dist/keycloak/keycloak.service'
import { UserService } from '../server-nest/dist/users/user.service'
import { UserDTO } from '../server-nest/dist/dtos/user.dto'

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

  const ingestData = JSON.parse(await fs.readFile('../data/ingests/20201004-lego.json', 'utf-8'))
  const project = _.first(ingestData)
  

  // Start ingesting users
  const userSuccesses = await pMap(_.get(project, 'access', []), async user => {
    const party = _.get(user, 'party')
    const newUser = {
      id: party.id,
      displayFullName: `${party.prename} ${party.sortname}`,
      givenName: party.prename,
      familyName: party.sortname,
      emailPrimary: party.email,
      authServerId: null
    }
    newUser.authServerId = await keycloakService.registerUser(
      newUser.emailPrimary,
      newUser.givenName,
      newUser.familyName
    )
    const userDTO: UserDTO = new UserDTO(newUser)
    try {
      await userService.createUser(userDTO)
      return true
    } catch (error) {
      console.log(`Error when adding ${newUser.emailPrimary} (${newUser.authServerId}): ${error.msg}`)
      return false
    }
  })

  console.log(`Added ${_.sum(userSuccesses)} users`)

  // Next projects
  // TODO ingest projects

  await knex.destroy()
  await app.close()
}

main()