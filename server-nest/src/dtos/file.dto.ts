export class FileDTO {
    name: string
    uploadedById: number
    fileobjectId: number
    assetId: number
    uploadedDatetime: string
    // createdDateTime: string
    fileFormatId: string
  
    constructor (file: Partial<FileDTO>) {
        Object.assign(this, file)
    }
}