import _, { random } from 'lodash'
import Knex from 'knex'
import pMap from 'p-map'
import faker from 'faker'
import * as crypto from 'crypto'
import { promises as fs } from 'fs'

import { bootstrap } from '../server-nest/dist/sdk'
import { KeycloakService } from '../server-nest/src/keycloak/keycloak.service'
import { UserService } from '../server-nest/dist/users/user.service'
import { AssetService } from '../server-nest/src/asset/asset.service'
import { FileService } from '../server-nest/src/file/file.service'
import { UserDTO } from '../server-nest/dist/dtos/user.dto'
import { AssetDTO } from '../server-nest/src/dtos/asset.dto'
import { FileDTO } from '../server-nest/src/dtos/file.dto'
import { FileObjectDTO } from '../server-nest/src/dtos/fileobject.dto'

async function main () {
  const app = await bootstrap()
  const keycloakService = app.get(KeycloakService)
  const userService = app.get(UserService)
  const assetService = app.get(AssetService)
  const fileService = app.get(FileService)

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
  
  // Start ingesting users
  const userSuccesses = await pMap(ingestData, async (data) => {
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

        if (!keycloakUser) {
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

      if (!newUser.authServerId) return false

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

  const pamSuccesses = await pMap(ingestData, async (pam) => {
    // We only consider the first listed owner
    const createdById = _.get(pam, 'owners')[0].id

    if (!createdById) return false

    const pamName = _.get(pam, 'name')
    const pamId = _.get(pam, 'id')
    try {
      const pamAsset = await assetService.insertAsset(new AssetDTO({
        id: pamId,
        createdById: createdById, 
        name: pamName,
        assetType: 'pam',
        privacyType: 'private'
      }))
    } catch (error) {
      console.error(`Error when adding ${pamName} pam: ${error.message}`)
      return false
    }

    const foldersSuccesses = await pMap(_.get(pam, 'containers', []), async (folder) => {
      const folderId = _.get(folder, 'id')
      const folderName = _.get(folder, 'name') || `Folder ${folderId}`
      try {
        const folderAsset = await assetService.insertAsset(new AssetDTO({
          id: folderId,
          createdById: createdById,
          name: folderName,
          assetType: 'folder',
          privacyType: 'private',
          parentId: pamId
        }))
      } catch (error) {
        console.error(`Error when adding ${folderName} folder: ${error.message}`)
        return false
      }

      const filesSuccesses = await pMap(_.get(folder, 'assets', []), async (file) => {
        const fileId = _.get(file, 'id')
        const fileName = _.get(file, 'name') || `File ${fileId}`

        try {
          const fileAsset = await assetService.insertAsset(new AssetDTO({
            id: fileId,
            createdById: createdById,
            name: fileName,
            assetType: 'file',
            privacyType: 'private',
            parentId: folderId
          }))
        } catch (error) {
          console.error(`Error when adding ${fileName} file: ${error.message}`)
          return false
        }

        const fileobjectsSize = _.get(file, 'size') || faker.random.number(100000)

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
          
            if (!fileobjectId) return false
            const fileFormat = fileName.split('.').pop() || faker.system.commonFileExt()
    
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
      })

      console.log(`Added ${filesSuccesses.length} files in folder ${folderId}`)
      return true
    })

    console.log(`Added ${foldersSuccesses.length} folders in pam ${pamId}`)
    return true
  })

  console.log(`Added ${pamSuccesses.length} pams`)
  await knex.destroy()
  await app.close()
}

main()