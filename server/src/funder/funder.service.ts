import { Injectable } from '@nestjs/common'
import { isEmpty } from 'lodash'
import { resolve } from 'path'
import { GQL_DIR } from '../common/constants'
import { FunderDTO } from '../dtos/funder.dto'
import { GqlClientService } from '../gqlClient/gqlClient.service'
import { SearchService } from '../search/search.service'

@Injectable()
export class FunderService {
  constructor (
    private readonly client: GqlClientService,
    private readonly searchService: SearchService
  ) {}

  async addFunders (funders: FunderDTO[]): Promise<void> {
    if (funders == null) throw new Error('Funder Cannot be null')

    const { returning: fundersResult } = await this.client.adminMutate(
      resolve(GQL_DIR, 'insertFunders.gql'),
      { object: [...funders] }
    )

    if (isEmpty(fundersResult)) throw new Error('Funders were not added')

    for (const funder of fundersResult as FunderDTO[]) {
      try {
        const status = await this.indexFunder(new FunderDTO(funder))

        if (status > 200) {
          console.error(`Typesense could not index ${funder.name}`)
        }
      } catch (error) {
        console.error('Typesense error', error.message)
      }
    }
  }

  async indexFunder (funder: FunderDTO): Promise<number> {
    const status = await this.searchService.createTypesense(
      'databrary-funders',
      funder.document
    )

    return status
  }
}
