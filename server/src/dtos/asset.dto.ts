import { PrivacyType, AssetType } from '../common/types'

export class AssetDTO {
  id: number
  name: string
  createdById: number
  assetType: AssetType
  privacyType: PrivacyType
  parentId: number
  datetimeCreated: string
  permissionsetId: number

  constructor (asset: Partial<AssetDTO>) {
    Object.assign(this, asset)
  }
}
