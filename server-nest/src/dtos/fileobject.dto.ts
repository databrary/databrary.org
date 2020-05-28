
export class FileObjectDTO {
    md5: string
    size: number
    sha1: string
    sha256: string
    location: string

    constructor(fileObject: Partial<FileObjectDTO>) {
        Object.assign(this, fileObject)
    }
}