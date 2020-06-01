import { RecordMetaDataKey } from 'src/common/types'

export class RecordDTO {
  readonly key: string
  readonly eTag: string
  readonly size: number
  readonly contentType: string
  private userMetadata: Partial<Record<RecordMetaDataKey, any>>

  constructor (record: Partial<RecordDTO>) {
    Object.assign(this, record)
  }

  public set assetId (assetId: number) {
    this.userMetadata['X-Amz-Meta-Asset-Id'] = assetId
  }

  public get assetId (): number {
    return this.userMetadata['X-Amz-Meta-Asset-Id']
  }

  public get fileExtension (): string {
    return this.userMetadata['X-Amz-Meta-File-Extension']
  }

  public get uploadType (): string {
    return this.userMetadata['X-Amz-Meta-Upload-Type']
  }

  public get userId (): number {
    return this.userMetadata['X-Amz-Meta-User-Id']
  }

  public get fileName (): string {
    return this.userMetadata['X-Amz-Meta-File-Name']
  }

  public set fileDimension (dimension: number) {
    this.userMetadata['X-Amz-Meta-File-Size'] = dimension
  }

  public get fileDimension (): number {
    return Number(this.userMetadata['X-Amz-Meta-File-Size'])
  }

  public get metaData (): Partial<Record<RecordMetaDataKey, any>> {
    return this.userMetadata
  }
}
