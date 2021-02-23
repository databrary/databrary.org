/* eslint-disable @typescript-eslint/restrict-template-expressions */
import _ from 'lodash'
import pMap from 'p-map'
import * as crypto from 'crypto'
import faker from 'faker'

import { INestApplicationContext } from '@nestjs/common'
import { readFileSync } from 'fs'
import { bootstrap } from 'src/sdk'
import { KeycloakService } from '../keycloak/keycloak.service'
import { UserService } from '../users/user.service'
import { AssetService } from '../asset/asset.service'
import { FileService } from '../file/file.service'
import { FunderService } from '../funder/funder.service'
import { UserDTO } from '../dtos/user.dto'
import { FileDTO } from '../dtos/file.dto'
import { FileObjectDTO } from '../dtos/fileobject.dto'
import { FunderDTO } from '../dtos/funder.dto'

type CommandType = '--users' | '--datasets' | '--funders'

interface Command {
  type: CommandType
  file: string
}

interface Funder {
  doi: string
  name: string
}

async function run () {
//   const app = await bootstrap()
  const commands = parseArgs(process.argv.slice(2))
  const app = await bootstrap()

  for (const command of commands) {
    try {
      const data = JSON.parse(readFileSync(command.file, 'utf-8'))
      console.log(`Ingest ${command.type} from ${command.file} ...`)
      switch (command.type) {
        case '--users':
          await ingestUsers(app, data)
          break
        case '--funders':
          await ingestFunders(app, data)
          break
        case '--datasets':
          await ingestDataset(app, data)
          break
        default:
          break
      }
    } catch (error) {
      console.error(`Error in command ${command.type}`, error.message)
    }
  }
  await app.close()
}

const parseArgs = (args: string[]): Command[] => {
  if (args.length === 0) throw Error('please provide arguments to the script')

  const isCommand = (str: string): str is CommandType => {
    return ['--users', '--datasets', '--funders'].includes(str)
  }

  const parseArg = (arg): Command => {
    const argArr = arg.split('=')
    if (argArr.length !== 2) throw Error(`Length of argument is invalid ${arg}`)
    if (!isCommand(argArr[0])) throw Error(`${argArr[0]} is not a valid command`)
    const command: Command = {
      type: argArr[0],
      file: argArr[1]
    }
    return command
  }

  const commands: Command[] = []

  for (const arg of args) {
    try {
      const command = parseArg(arg)
      commands.push(command)
    } catch (error) {
      console.error(`Cannot parse ${arg} argument,`, error.message)
    }
  }

  return commands
}

async function ingestUsers (app: INestApplicationContext, users: any): Promise<void> {
  const keycloakService = app.get(KeycloakService)
  const userService = app.get(UserService)
  const userSuccesses = await pMap(users, async (data) => {
    const userSuccesses = await pMap(_.get(data, 'access', []), async user => {
      const party = _.get(user, 'party')
      const newUser = {
        id: party.id,
        givenName: party.prename,
        familyName: party.sortname,
        emailPrimary: party.email,
        authServerId: null
      }
      try {
        const keycloakUser = await keycloakService.findUser(newUser.emailPrimary)

        if (keycloakUser == null) {
          newUser.authServerId = await keycloakService.registerUser(
            newUser.emailPrimary,
            newUser.givenName,
            newUser.familyName
          )
        } else {
          newUser.authServerId = keycloakUser.id
        }
      } catch (error) {
        console.log(`Error when adding ${newUser.emailPrimary} to keycloak: ${error.message}`)
        return false
      }

      if (newUser.authServerId == null) return false

      const userDTO: UserDTO = new UserDTO(newUser)
      try {
        await userService.createUser(userDTO)
        return true
      } catch (error) {
        console.log(`Error when adding ${newUser.emailPrimary} (${newUser.authServerId}): ${error.message}`)
        return false
      }
    })
    return _.sum(userSuccesses)
  })

  console.log(`Added ${_.sum(userSuccesses)} users`)
}

async function ingestDataset (app: INestApplicationContext, datasets: any) {
  const assetService = app.get(AssetService)
  const fileService = app.get(FileService)
  const pamSuccesses = await pMap(datasets, async (pam) => {
    // We only consider the first listed owner
    const createdById = _.get(pam, 'owners')[0].id

    if (createdById == null) return false

    const pamName = _.get(pam, 'name')
    const pamId = _.get(pam, 'id')
    try {
      await assetService.insertAsset(
        {
          id: pamId,
          createdById: createdById,
          name: pamName,
          assetType: 'pam',
          privacyType: 'private'
        }
      )

      const foldersSuccesses = await pMap(_.get(pam, 'containers', []), async (folder) => {
        const folderId = _.get(folder, 'id')
        const folderName = _.get(folder, 'name', `Folder ${folderId}`)
        try {
          await assetService.insertAsset(
            {
              id: folderId,
              createdById: createdById,
              name: folderName,
              assetType: 'folder',
              privacyType: 'private',
              parentId: pamId
            }
          )

          const filesSuccesses = await pMap(_.get(folder, 'assets', []), async (file) => {
            const fileId = _.get(file, 'id')
            const fileName = _.get(file, 'name', `File ${fileId}`)

            try {
              await assetService.insertAsset(
                {
                  id: fileId,
                  createdById: createdById,
                  name: fileName,
                  assetType: 'file',
                  privacyType: 'private',
                  parentId: folderId
                }
              )

              const fileobjectsSize = _.get(file, 'size', faker.random.number({ min: 10000, max: 1000000 }))

              const fileobjectsSha256 = crypto.createHash('sha256').update(fileName).digest().toString('hex')
              const fileobjectsSha1 = crypto.createHash('sha1').update(fileName).digest().toString('hex')
              const fileobjectsMd5 = crypto.createHash('md5').update(fileName).digest().toString('hex')
              try {
                const fileobjectId = await fileService
                  .insertFileObject(new FileObjectDTO({
                    location: 's3://minio-1.nyu.edu/cas',
                    size: fileobjectsSize,
                    sha1: fileobjectsSha1,
                    sha256: fileobjectsSha256,
                    md5: fileobjectsMd5
                  }))

                if (fileobjectId == null) return false
                const fileFormat = fileName.split('.').pop().length > 4
                  ? faker.system.commonFileExt()
                  : fileName.split('.').pop()

                await fileService
                  .insertFile(new FileDTO({
                    name: fileName,
                    assetId: fileId,
                    fileFormatId: fileFormat,
                    uploadedById: createdById,
                    fileobjectId: fileobjectId
                  }))

                return true
              } catch (error) {
                console.error(`Error when adding fileobject and file for ${fileName} file asset: ${error.message}`)
                return false
              }
            } catch (error) {
              console.error(`Error when adding ${fileName} file: ${error.message}`)
              return false
            }
          })

          console.log(`Added ${filesSuccesses.length} files in folder ${folderId}`)
          return true
        } catch (error) {
          console.error(`Error when adding ${folderName} folder: ${error.message}`)
          return false
        }
      })

      console.log(`Added ${foldersSuccesses.length} folders in pam ${pamId}`)
      return true
    } catch (error) {
      console.error(`Error when adding ${pamName} pam: ${error.message}`)
      return false
    }
  })

  console.log(`Added ${pamSuccesses.length} pams`)
}

async function ingestFunders (app: INestApplicationContext, funders: FunderDTO[]) {
  const funderService = app.get(FunderService)
  for (const funder of funders) {
    try {
      await funderService.addFunders([funder])
    } catch (error) {
      console.error(`Add ${funder.name} Funder error`, error.message)
    }
  }
}

run()
  .then((_) => console.log('Ingest done'))
  .catch((error) => console.error('script error', error.message))
