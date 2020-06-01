import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'

import { resolve, parse, join } from 'path'
import { readdir, unlink } from 'fs'

import { MinioService } from 'src/minio/minio.service'
import { UserService } from 'src/users/user.service'
import { FileService } from 'src/file/file.service'

import { FileObjectDTO } from 'src/dtos/fileobject.dto'
import { RecordDTO } from 'src/dtos/record.dto'
import { FileDTO } from 'src/dtos/file.dto'

import { ImageKey } from 'src/common/types'
import { TMP_FOLDER, AVATAR_SIZES, AVATAR_FORMAT } from 'src/common/constants'

import * as sharp from 'sharp'

@Processor('QUEUE')
export class TaskProcessor {
  constructor (
    private readonly minioService: MinioService,
    private readonly userService: UserService,
    private readonly fileService: FileService
  ) {}

  @Process('uploads')
  async handleUploads (job: Job) {
    console.log('uploads', job.data)
    // Get Data from s3 record
    const record = new RecordDTO(job.data)

    switch (record.uploadType) {
      case 'file':
        console.log('Start file upload...')
        try {
          const fileObject: FileObjectDTO = await this.minioService.hashAndSizeMinio('uploads', record.key)
          if (record.size !== fileObject.size) {
            console.error('Size mismatch') // TODO We need an error here
          }

          const fileExistsInBucket = await this.minioService.fileExists('cas', fileObject.sha256)
          if (fileExistsInBucket) break

          // Use the provided MD5 or eTag value as a file name in CAS
          await this.minioService.copyObject('cas', fileObject.sha256, `/uploads/${record.key}`, record.eTag)
          console.log('End file upload...')
        } catch (error) {
          console.error(error)
          // Retry the Job
        }
        break
      case 'avatar':
        console.log('Start avatar upload...')
        try {
          // Create a new assetId (We can remove this if we create the asset before the upload)
          console.log(`Create avatar asset for ${record.userId}`)
          const asset = await this.userService.insertAsset(
            record.userId,
            `User ${record.userId} Avatar`,
            'avatar',
            'public'
          )

          record.assetId = asset.id
          console.log(`Avatar asset id ${record.assetId} for ${record.assetId}`)
          // Download the image
          // tmp placeholder for the original upload
          const originalFile = resolve(TMP_FOLDER, record.key)

          console.log(`Download object ${record.key}...`)
          const downloaded = await this.minioService.getObject('uploads', record.key, originalFile)
          if (!downloaded) break

          const fileObject: FileObjectDTO = await FileObjectDTO.hashAndSizeFile(originalFile, 'public')

          console.log(`Upload image ${record.key} as ${fileObject.sha256}...`)
          const fileUploaded = await this.minioService.uploadObject(
            'public',
            fileObject.sha256,
            originalFile,
            { ...record.metaData }
          )

          if (!fileUploaded) return

          for (const [key, size] of Object.entries(AVATAR_SIZES)) {
            record.fileDimension = size

            const fileName = `${parse(record.key).name}_${size}.${AVATAR_FORMAT}`
            const targetPath = resolve(TMP_FOLDER, fileName)

            console.log(`Resize image ${record.key} to ${record.fileDimension}...`)
            const info = await this.resizePicture(originalFile, targetPath, size)
            if (!info) continue

            const fileObject: FileObjectDTO = await FileObjectDTO.hashAndSizeFile(targetPath, 'public')

            console.log(`Upload image ${fileObject.sha256}...`)
            const fileUploaded = await this.minioService.uploadObject(
              'public',
              fileObject.sha256,
              targetPath,
              {
                ...record.metaData,
                'X-Amz-Meta-File-Size': size
              }
            )
          }
          console.log('End avatar upload...')
        } catch (error) {
          console.error(error)
        } finally {
          readdir(TMP_FOLDER, (err, files) => {
            if (err) throw err

            for (const file of files) {
              unlink(join(TMP_FOLDER, file), err => {
                if (err) throw err
              })
            }
          })
        }
        break

      default:
        break
    }
  }

  @Process('public')
  async handlePublic (job: Job) {
    console.log('Start Public Job...')

    console.log('public', job.data)
    const record = new RecordDTO(job.data)

    if (!record.metaData) {
      console.error('Public Process requires user meta data')
      return
    }

    if (!record.assetId) {
      console.error('Public Process requires an assetId')
      return
    }

    const file: FileDTO = new FileDTO({
      name: record.fileName,
      assetId: record.assetId,
      fileFormatId: record.fileExtension,
      uploadedById: record.userId
      // createdDateTime: new Date().toISOString()
    })

    try {
      const fileObject: FileObjectDTO = await this.minioService.hashAndSizeMinio('public', record.key)
      if (record.size !== fileObject.size) {
        console.error('Size mismatch') // TODO We need an error here
      }

      console.log('Insert a file object')
      file.fileobjectId = await this.fileService.insertFileObject(fileObject)

      if (!file.fileobjectId) {
        // Remove file in cas/public bucket if we cannot create a fileobject
        return
      }

      file.uploadedDatetime = new Date().toISOString()
      console.log('Insert a file')
      await this.fileService.insertFile(file)

      if (!record.fileDimension) {
        console.log('File size not found')
        return
      }

      const uri = `http://localhost:9000/public/${record.key}`

      let image: Partial<Record<ImageKey, any>>

      switch (record.fileDimension) {
        case 32:
          image = { thumbnail: uri }
          break
        case 400:
          image = { large: uri }
          break

        default:
          break
      }

      console.log('update user avatar')
      await this.userService.updateUserAvatar(record.userId, record.assetId, image)
    } catch (error) {
      if (file.fileobjectId) {
        // Remove fileObject from db
      }

      // Delete object from CAS

      // Retry the Job
      console.error(error)
    }
    console.log('End Public Job...')
  }

  @Process('cas')
  async handleCas (job: Job) {
    console.log('Start CAS Job...')
    console.log('cas', job.data)

    const record = new RecordDTO(job.data)

    if (!record.assetId) {
      console.log('CAS Process requires an assetId')
      return
    }

    const file: FileDTO = new FileDTO({
      name: record.fileName,
      assetId: record.assetId,
      fileFormatId: record.fileExtension,
      uploadedById: record.userId
      // createdDateTime: new Date().toISOString()
    })

    try {
      const fileObject: FileObjectDTO = await this.minioService.hashAndSizeMinio('cas', record.key)
      if (record.size !== fileObject.size) {
        console.error('Size mismatch') // TODO We need an error here
      }

      file.fileobjectId = await this.fileService.insertFileObject(fileObject)

      if (!file.fileobjectId) {
        // Remove file in cas/public bucket if we cannot create a fileobject
        return
      }

      file.uploadedDatetime = new Date().toISOString()
      await this.fileService.insertFile(file)
    } catch (error) {
      if (file.fileobjectId) {
        // Remove fileObject from db
      }

      // Delete object from CAS

      // Retry the Job
      console.error(error)
    }
    console.log('End CAS Job...')
  }

  private async resizePicture (sourcePath: string, targetpath: string, size: number) {
    return await new Promise((resolve, reject) => {
      sharp(sourcePath)
        .resize(size, size)
        .toFormat('png')
        .toFile(targetpath, (err, info) => {
          if (err) {
            reject(err)
          }
          resolve(info)
        })
    })
  }
}
