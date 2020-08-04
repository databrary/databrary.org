import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ApolloClient,
  FetchPolicy,
  InMemoryCache,
  NormalizedCacheObject,
  createHttpLink,
  gql,
  DocumentNode
} from '@apollo/client'
import { readFile } from 'fs-extra'
import { first, values } from 'lodash'
import fetch from 'cross-fetch'

@Injectable()
export class GqlClientService {
  private readonly secret = this.configService.get('HASURA_SECRET')
  private readonly uri = this.configService.get('HASURA_URI')

  private readonly adminClient: ApolloClient<NormalizedCacheObject>
  private cache = {}

  constructor (private readonly configService: ConfigService) {
    this.adminClient = this.createAdminClient()
  }

  private createAdminClient () {
    const headers = {
      'x-hasura-admin-secret': this.secret,
      'X-Hasura-Role': 'admin'
    }

    const link = createHttpLink({
      uri: this.uri,
      fetch,
      headers
    })

    return new ApolloClient({
      link,
      cache: new InMemoryCache()
    })
  }

  // Public functions
  async adminQuery (
    path: string,
    variables?: Record<string, unknown>,
    fetchPolicy?: FetchPolicy
  ): Promise<any> {
    const response = await this.adminClient.query({
      query: await this.getFileContent(path),
      fetchPolicy,
      variables
    })
    return first(values(response.data))
  }

  async adminMutate (
    path: string,
    variables?: Record<string, unknown>
  ): Promise<any> {
    const response = await this.adminClient.mutate({
      mutation: await this.getFileContent(path),
      variables
    })
    return first(values(response.data))
  }

  private async getFileContent (path: string): Promise<DocumentNode> {
    if (process.env.NODE_ENV === 'production') {
      if (this.cache[path] === undefined) {
        const fileContent = await readFile(path)
        this.cache[path] = gql`
          ${fileContent}
        `
      }
      return this.cache[path]
    }

    return gql`
      ${await readFile(path)}
    `
  }
}
