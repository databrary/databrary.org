import { Injectable, Inject } from '@nestjs/common'
// import { ElasticsearchService } from '@nestjs/elasticsearch'
// import { isEmpty } from 'lodash'
import { Index } from '../common/types'
import { UserDTO } from 'src/dtos/user.dto'
import { Client } from 'typesense'

@Injectable()
export class SearchService {
  private readonly client
  constructor (
    // private readonly client: ElasticsearchService,
    @Inject('TYPESENSE_CONFIG') private readonly config: Record<string, unknown>
  ) {
    this.client = new Client(config)
    this.initCollections()
  }

  // This might fail if typesense server is not ready
  private initCollections () {
    const schemas: Array<Record<string, unknown>> = [UserDTO.schema]
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

  // ElasticSearch functions
  // async create (id: string, index: Index, doc: Record<string, unknown>, refresh: any = 'true'): Promise<number> {
  //   try {
  //     const { statusCode } = await this.client.create({
  //       id: id,
  //       index: index,
  //       refresh: refresh,
  //       body: { doc: doc }
  //     })
  //     return statusCode
  //   } catch (error) {
  //     console.error(error.message)
  //   }
  //   return 400
  // }

  // async update (id: string, index: Index, doc: Record<string, unknown>, refresh = true): Promise<number> {
  //   try {
  //     const { statusCode } = await this.client.update({
  //       id: id,
  //       index: index,
  //       refresh: refresh ? 'true' : 'false',
  //       retry_on_conflict: 3,
  //       body: { doc: doc }
  //     })
  //     return statusCode
  //   } catch (error) {
  //     throw new Error(error.message)
  //   }
  // }

  // async searchAll (search: string): Promise<UserDTO []> {
  //   const {
  //     body: {
  //       hits: { hits }
  //     }
  //   } = await this.client.search({
  //     index: 'databrary-*',
  //     body: {
  //       query: { multi_match: { query: search } }
  //     }
  //   })

  //   if (isEmpty(hits)) return []

  //   const result: UserDTO [] = hits.map(
  //     ({ id, _index: index, _score: score, _source: { doc, ...ingest } }) => {
  //       const user = isEmpty(ingest) ? doc : ingest
  //       return { index, id, score, ...user }
  //     }
  //   )

  //   return result
  // }
}
