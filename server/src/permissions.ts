import Knex from 'knex'
import knexConfig from '../knexfile'
const knex = Knex(knexConfig.development)

import { createUser } from './units/users'
import { addUserToEnclave, addProjectToEnclave } from './units/enclaves'
import { createProject, getProject } from './units/projects'

function lookup (category: string, property: string) {
  const types = {
    asset: {
      project: 1,
      file: 2
    },
    permission: {
      read: 1,
      write: 2,
      admin: 3
    },
    enclave: {
      'org.databrary': 1,
      'org.zoobrary': 2
    }
  }
  return types[category][property]
}

async function main () {
  await knex.transaction(async (knex: any) => {
    const userId = await createUser({
      knex,
      fullName: 'Bill Heath'
    })

    await addUserToEnclave({
      knex,
      userId,
      enclaveId: lookup('enclave', 'org.zoobrary')
    })

    const projectId = await createProject({
      knex,
      userId,
      name: 'Trial 1147343',
      description: 'A test project',
      assetTypeId: lookup('asset', 'project'),
      permissionTypeId: lookup('permission', 'admin')
    })

    await addProjectToEnclave({
      knex,
      projectId,
      enclaveId: lookup('enclave', 'org.zoobrary'),
      permissionTypeId: lookup('permission', 'read')
    })

    await knex.commit()
  })
  // const result = await getProject({
  //   knex,
  //   id: 4,
  //   projectTypeId: lookup('asset', 'project'),
  //   select: ['id', 'name', 'groups']
  // })
  // console.log(result)
}

// tslint:disable-next-line: no-floating-promises
main()
