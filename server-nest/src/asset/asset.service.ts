import { Injectable } from '@nestjs/common'
import { GqlClientService } from '../gqlClient/gqlClient.service'

import { resolve } from 'path'
import { isEmpty } from 'lodash'
import { GQL_DIR } from '../common/constants'

@Injectable()
export class AssetService {
  constructor (private readonly client: GqlClientService) {}

  async insertAsset (
    id: number,
    name: string,
    assetType: string,
    privacyType: string
  ) {
    const { returning: assets } = await this.client.adminMutate(
      resolve(GQL_DIR, 'insertAsset.gql'),
      {
        id: id,
        name: name,
        asset_type: assetType,
        privacy_type: privacyType
      }
    )

    return isEmpty(assets) ? null : assets[0]
  }

  async removeAsset (id: number) {
    const { returning: assets } = await this.client.adminMutate(
      resolve(GQL_DIR, 'removeAsset.gql'),
      {
        id: id
      }
    )

    return isEmpty(assets) ? null : assets[0]
  }
}
