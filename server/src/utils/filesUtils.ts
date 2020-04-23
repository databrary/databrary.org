export interface IFileInfo {
  size: number
  md5: string
  sha1: string
  sha256: string
  location?: string
  fileId?: number
  isUploaded?: boolean // If the file is in the upload bucket
  filePath?: string
  dimension?: number // dimension in pixel
  URI?: string // public uri if exists, only used for avatar
}
