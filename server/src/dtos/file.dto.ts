export class FileDTO {
  name: string
  uploadedById: number
  fileobjectId: number
  assetId: number

  fileFormatId: string

  constructor (file: Partial<FileDTO>) {
    Object.assign(this, file)
  }
}
