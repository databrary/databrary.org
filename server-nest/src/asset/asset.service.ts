import { Injectable } from '@nestjs/common'
import { GqlClientService } from '../gqlClient/gqlClient.service'

import { resolve } from 'path'
import _ from 'lodash'
import { GQL_DIR } from '../common/constants'
import { AssetDTO } from '../dtos/asset.dto'
import { MinioService } from '../minio/minio.service'
import { Buckets } from '../common/types'

@Injectable()
export class AssetService {
  constructor (
    private readonly client: GqlClientService,
    private readonly minioClient: MinioService
  ) {}

  async insertAsset (asset: Record<string, unknown>): Promise<AssetDTO> {
    if (asset == null) throw new Error('Asset must be defined')

    const { returning: assets } = await this.client.adminMutate(
      resolve(GQL_DIR, 'insertAsset.gql'),
      {
        ...asset
      }
    )

    if (_.isEmpty(assets)) throw new Error('Error while inserting an asset')
    if (assets[0].id == null) throw new Error('Asset must contain an id')

    return new AssetDTO(assets[0])
  }

  async getAssetSHA (assetId: number): Promise<Record<string, string> | null> {
    if (assetId == null) throw new Error('Asset id is required')

    const assets = await this.client.adminMutate(
      resolve(GQL_DIR, 'getAssets.gql'),
      {
        assetId
      }
    )

    if (_.isEmpty(assets)) throw new Error('Error while getting an asset')
    if (assets[0].id == null) throw new Error('Asset must contain an id, return an id in the GQL call')
    if (assets[0].assetType !== 'file') throw new Error('Only File Assets are supported for now')

    const name = _.get(assets[0], 'file.fileobject.sha256', null)
    const format = _.get(assets[0], 'file.fileFormatId', null)

    return {
      name,
      format
    }
  }

  async getPresignedUrl (sha256: string, bucket: Buckets = 'cas'): Promise<string> {
    return await this.minioClient.getPresignedUrl(bucket, sha256)
  }
}
