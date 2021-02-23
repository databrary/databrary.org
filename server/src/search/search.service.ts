import { Injectable, Inject } from '@nestjs/common'
import { Index } from '../common/types'
import { UserDTO } from '../dtos/user.dto'
import { FunderDTO } from '../dtos/funder.dto'
import { Client } from 'typesense'

@Injectable()
export class SearchService {
  private readonly client
  constructor (
    @Inject('TYPESENSE_CONFIG') private readonly config: Record<string, unknown>
  ) {
    this.client = new Client(config)
    this.initCollections()
  }

  // This might fail if typesense server is not ready
  private initCollections () {
    const schemas: Array<Record<string, unknown>> = [UserDTO.schema, FunderDTO.schema]
    for (const schema of schemas) {
      this.client.collections().create(schema)
        .then(function (data) {
          console.log(`Schema ${JSON.stringify(schema.name)} created`)
        }).catch((error) => {
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          if (!error.message.includes('already exists')) {
            console.log(error.message)
          }
        })
    }
  }

  private async deleteTypesense (index: Index, docId: number): Promise<boolean> {
    try {
      const searchParameters = {
        q: `${docId}`,
        query_by: 'docIdS'
      }

      const docs = await this.searchTypesense(searchParameters, index)

      if (docs == null) return false

      for (const doc of docs) {
        await this.client.collections(index).documents(doc.id).delete()
      }

      return true
    } catch (error) {
      console.error(error.message)
    }

    return false
  }

  async createTypesense (index: Index, doc: Record<string, unknown>): Promise<number> {
    try {
      await this.client
        .collections(index)
        .documents()
        .create(doc)

      return 200
    } catch (error) {
      console.error(error.message)
    }
    return 400
  }

  async searchTypesense (search: Record<string, unknown>, index: Index): Promise<UserDTO []> {
    try {
      const { hits } = await this.client
        .collections(index)
        .documents()
        .search(search)

      // the id referes to typesense id and the docId refers to the userId
      const result: UserDTO [] = hits.map(
        ({ document: { ...user } }) => {
          return user
        }
      )

      return result
    } catch (error) {
      console.log(error.message)
    }
  }

  async updateTypesense (index: Index, oldDocId: number, newDoc: Record<string, unknown>): Promise<number> {
    if (await this.deleteTypesense(index, oldDocId)) {
      return await this.createTypesense(index, newDoc)
    }

    return 400
  }
}
