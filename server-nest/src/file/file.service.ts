import { Injectable } from '@nestjs/common'
import { GqlClientService } from 'src/gqlClient/gqlClient.service'

import { isEmpty } from 'lodash'
import { FileDTO } from 'src/dtos/file.dto'
import { FileObjectDTO } from 'src/dtos/fileobject.dto'

@Injectable()
export class FileService {
  private readonly GQL_FOLDER = `${process.cwd()}/../gql`

  constructor (
    private readonly client: GqlClientService
  ) {}

  async insertFile (file: FileDTO) {
    const path = `${this.GQL_FOLDER}/insertFile.gql`

    const { returning: users } = await this.client.adminMutate(
      path,
      file
    )

    return isEmpty(users) ? null : users[0]
  }

  async insertFileObject (fileObject: FileObjectDTO) {
    const path = `${this.GQL_FOLDER}/insertFileObjectOnUpload.gql`
    
    const { returning: users } = await this.client.adminMutate(
      path, 
      fileObject
    )
  
    return isEmpty(users) ? null : users[0].id
  }

  async getFileObjectId (fileObject: FileObjectDTO) {
    const path = `${this.GQL_FOLDER}/getFileObjectId.gql`
    const users = await this.client.adminQuery(
      path, 
      {
        sha256: fileObject.sha256
      }
    )

    return isEmpty(users) ? null : users[0].id
  }
  
}
