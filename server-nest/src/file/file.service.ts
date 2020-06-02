import { Injectable } from '@nestjs/common'
import { isEmpty } from 'lodash'
import { resolve } from 'path'

import { GqlClientService } from 'src/gqlClient/gqlClient.service'

import { FileDTO } from 'src/dtos/file.dto'
import { FileObjectDTO } from 'src/dtos/fileobject.dto'

import { AVATAR_FORMAT, GQL_DIR } from 'src/common/constants'

import * as sharp from 'sharp'

@Injectable()
export class FileService {
  constructor(private readonly client: GqlClientService) {}

  async insertFile(file: FileDTO) {
    const path = resolve(GQL_DIR, `insertFile.gql`)

    const { returning: users } = await this.client.adminMutate(path, file)

    return isEmpty(users) ? null : users[0]
  }

  async insertFileObject(fileObject: FileObjectDTO) {
    const { returning: users } = await this.client.adminMutate(
      resolve(GQL_DIR, `insertFileObjectOnUpload.gql`),
      fileObject
    )

    return isEmpty(users) ? null : users[0].id
  }

  async getFileObjectId(fileObject: FileObjectDTO) {
    const users = await this.client.adminQuery(
      resolve(GQL_DIR, `/getFileObjectId.gql`),
      {
        sha256: fileObject.sha256
      }
    )

    return isEmpty(users) ? null : users[0].id
  }

  async resizePicture(sourcePath: string, targetpath: string, size: number) {
    return await new Promise((resolve, reject) => {
      sharp(sourcePath)
        .resize(size, size)
        .toFormat(AVATAR_FORMAT)
        .toFile(targetpath, (err, info) => {
          if (err) {
            reject(err)
          }
          resolve(info)
        })
    })
  }
}
