import { PrivacyType, AssetType } from '../common/types'

export class AssetDTO {
  id: number
  name: string
  createdById: number
  assetType: AssetType
  privacyType: PrivacyType

  constructor (asset: Partial<AssetDTO>) {
    Object.assign(this, asset)
  }
}
