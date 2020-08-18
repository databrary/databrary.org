import { Injectable } from '@nestjs/common'
import { GqlClientService } from '../gqlClient/gqlClient.service'

import { resolve } from 'path'
import { isEmpty } from 'lodash'
import { GQL_DIR } from '../common/constants'
import { AssetDTO } from '../dtos/asset.dto'

@Injectable()
export class AssetService {
  constructor (private readonly client: GqlClientService) {}

  async insertAsset (asset: AssetDTO): Promise<AssetDTO> {
    if (asset == null) throw new Error('Asset must be defined')

    const { returning: assets } = await this.client.adminMutate(
      resolve(GQL_DIR, 'insertAsset.gql'),
      {
        created_by_id: asset.createdById,
        name: asset.name,
        asset_type: asset.assetType,
        privacy_type: asset.privacyType
      }
    )

    if (isEmpty(assets)) throw new Error('Error while inserting an asset')
    if (assets[0].id == null) throw new Error('Asset must contain an id')

    return new AssetDTO(assets[0])
  }
}
