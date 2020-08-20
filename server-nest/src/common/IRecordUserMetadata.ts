
// Headers set in the Databrary client to persist values required in tasks
export interface IRecordUserMetadata {
  'X-Amz-Meta-Asset-Id'?: number
  'X-Amz-Meta-Upload-Type'?: string
  'X-Amz-Meta-User-Id'?: number
  'X-Amz-Meta-File-Extension'?: string
  'X-Amz-Meta-File-Name'?: string
  'X-Amz-Meta-File-Size'?: number
}
