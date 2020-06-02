export type ImageKey = 'thumbnail' | 'large'
export type ImageSize = 32 | 400 | null

export type RecordMetaDataKey =
  | 'X-Amz-Meta-Asset-Id'
  | 'X-Amz-Meta-Upload-Type'
  | 'X-Amz-Meta-User-Id'
  | 'X-Amz-Meta-File-Extension'
  | 'X-Amz-Meta-File-Name'
  | 'X-Amz-Meta-File-Size'
