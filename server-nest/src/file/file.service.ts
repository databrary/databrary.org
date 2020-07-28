import { Injectable } from '@nestjs/common'
import { isEmpty } from 'lodash'
import { resolve } from 'path'

import { GqlClientService } from '../gqlClient/gqlClient.service'

import { FileDTO } from '../dtos/file.dto'
import { FileObjectDTO } from '../dtos/fileobject.dto'

import { AVATAR_FORMAT, GQL_DIR } from '../common/constants'

import sharp from 'sharp'

@Injectable()
export class FileService {
  constructor (private readonly client: GqlClientService) {}

  async insertFile (file: FileDTO): Promise<FileDTO | null> {
    const { returning: files } = await this.client.adminMutate(
      resolve(GQL_DIR, 'insertFile.gql'),
      { ...file }
    )

    return isEmpty(files) ? null : files[0]
  }

  async insertFileObject (fileObject: FileObjectDTO): Promise<number | null> {
    const { returning: fileObjects } = await this.client.adminMutate(
      resolve(GQL_DIR, 'insertFileObjectOnUpload.gql'),
      { ...fileObject }
    )

    return isEmpty(fileObjects) ? null : fileObjects[0].id
  }

  async getFileObjectId (fileObject: FileObjectDTO): Promise<number | null> {
    const fileObjects = await this.client.adminQuery(
      resolve(GQL_DIR, '/getFileObjectId.gql'),
      {
        sha256: fileObject.sha256
      }
    )

    return isEmpty(fileObjects) ? null : fileObjects[0].id
  }

  async resizePicture (sourcePath: string, targetpath: string, size: number): Promise<any> {
    return await new Promise((resolve, reject) => {
      sharp(sourcePath)
        .resize(size, size)
        .toFormat(AVATAR_FORMAT)
        .toFile(targetpath, (err, info) => {
          if (err != null) {
            reject(err)
          }
          resolve(info)
        })
    })
  }
}
