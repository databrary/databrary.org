import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { FileDTO } from 'src/dtos/file.dto'
import { MinioService } from 'src/minio/minio.service'
import { UserService } from 'src/users/user.service'
import { FileService } from 'src/file/file.service'
import { extension } from 'mime-types'
import { resolve } from 'path'
import { FileObjectDTO } from 'src/dtos/fileobject.dto'

@Processor('QUEUE')
export class TaskProcessor {

  constructor(
    private readonly minioService: MinioService,
    private readonly userService: UserService,
    private readonly fileService: FileService
  ) {}

  @Process('uploads')
  async handleUploads(job: Job) {
    console.log('Start upload...')

    // Get Data from s3 record
    const { 
      key, 
      size, 
      eTag, 
      contentType,
      userMetadata: {
        'X-Amz-Meta-Asset-Id': assetId,
        'X-Amz-Meta-File-Extension': fileExtension,
        'X-Amz-Meta-Upload-Type': uploadType,
        'X-Amz-Meta-User-Id': uploadedById
      }
    } = job.data

    switch (uploadType) {
      case 'file':
        try {
          // TODO(Reda): use eTag or MD5 as a file name, Minio can provide an MD5 with the server
          // side encryption, no need to hash here
          const fileObject:FileObjectDTO = await this.minioService.hashAndSizeMinio('uploads', key)
          if (size !== fileObject.size) {
            console.error('Size mismatch') // TODO We need an error here
          }

          const fileExistsInBucket = await this.minioService.fileExists('cas', fileObject.sha256)
          if (fileExistsInBucket) break
          
          // Use the provided MD5 or eTag value as a file name in CAS
          await this.minioService.copyObject('cas', fileObject.sha256, `/uploads/${key}`, eTag) 
        } catch (error) {
          console.error(error)
        }
        break;
      case 'avatar':
        // Download the image
        // Create a new assetId (We can remove this if we create the asset before the upload)
        // Check if need to be processed
          // yes, download, resize it and send it back to upload
          // no, means that the avatar was processed already, push to cas
        break;
    
      default:
        break;
    }
  }

  @Process('cas')
  async handleCas(job: Job) {
    console.log(`Start CAS...`)

    const { 
      key, 
      size, 
      eTag, 
      contentType,
      userMetadata: {
        'X-Amz-Meta-Asset-Id': assetId,
        'X-Amz-Meta-File-Extension': fileFormatId,
        'X-Amz-Meta-Upload-Type': uploadType,
        'X-Amz-Meta-User-Id': uploadedById,
        'X-Amz-Meta-File-Name': name
      }
    } = job.data

    let file: FileDTO = new FileDTO({ 
      name,
      assetId, 
      fileFormatId, 
      uploadedById,
      // createdDateTime: new Date().toISOString()
    })

    try {
      console.log(`Hash and size file`)
      const fileObject:FileObjectDTO = await this.minioService.hashAndSizeMinio('cas', key)
      if (size !== fileObject.size) {
        console.error('Size mismatch') // TODO We need an error here
      }

      console.log(`Add file Object`)
      file.fileobjectId = await this.fileService.insertFileObject(fileObject)
  
      if (!file.fileobjectId) {
        // Remove file in cas/public bucket if we cannot create a fileobject
        return 
      }
    
      file.uploadedDatetime = new Date().toISOString()
      await this.fileService.insertFile(file)
    } catch (error) {
      console.error(error)
    }
  }
}