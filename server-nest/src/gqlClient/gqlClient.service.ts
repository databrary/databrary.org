import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ApolloClient, FetchPolicy } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'

import { readFile } from 'fs-extra'
import { first, values } from 'lodash'
import fetch from 'cross-fetch'
import gql from 'graphql-tag'

@Injectable()
export class GqlClientService {
  private readonly secret = this.configService.get('HASURA_SECRET')
  private readonly uri = this.configService.get('HASURA_URI')

  private readonly adminClient: ApolloClient<NormalizedCacheObject>
  private cache = {}

  constructor(private readonly configService: ConfigService) {
    this.adminClient = this.createAdminClient()
  }

  private createAdminClient() {
    const headers = {
      'x-hasura-admin-secret': this.secret
    }

    headers['X-Hasura-Role'] = 'admin'

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
  async adminQuery(
    path: string,
    variables?: object,
    fetchPolicy?: FetchPolicy
  ) {
    if (this.cache[path] === undefined) {
      const fileContent = await readFile(path)
      this.cache[path] = gql`
        ${fileContent}
      `
    }
    const response = await this.adminClient.query({
      query: this.cache[path],
      fetchPolicy,
      variables
    })
    return first(values(response.data))
  }

  async adminMutate(path: string, variables?: object) {
    if (this.cache[path] === undefined) {
      const fileContent = await readFile(path)
      this.cache[path] = gql`
        ${fileContent}
      `
    }
    const response = await this.adminClient.mutate({
      mutation: this.cache[path],
      variables
    })
    return first(values(response.data))
  }
}
