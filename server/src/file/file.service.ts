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

  async insertFile (file: FileDTO): Promise<FileDTO> {
    if (file == null) throw new Error('The file argument cannot be null or undefined')

    const { returning: files } = await this.client.adminMutate(
      resolve(GQL_DIR, 'insertFile.gql'),
      { ...file }
    )

    if (isEmpty(files)) throw new Error('Error while inserting a file')

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { __typename, ...newFile } = files[0]

    return new FileDTO(newFile[0])
  }

  async insertFileObject (fileObject: FileObjectDTO): Promise<number> {
    if (fileObject == null) throw new Error('You must provide a valid object to insertFileObject')

    const { returning: fileObjects } = await this.client.adminMutate(
      resolve(GQL_DIR, 'insertFileObject.gql'),
      { ...fileObject }
    )

    if (isEmpty(fileObjects)) throw new Error('Error while inserting a fileObject, id not found')

    return fileObjects[0].id
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
