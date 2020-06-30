import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueCompleted
} from '@nestjs/bull'
import { Job } from 'bull'

import { resolve, join } from 'path'
import { readdir, unlink } from 'fs'

import { MinioService } from '../minio/minio.service'
import { UserService } from '../users/user.service'
import { FileService } from '../file/file.service'

import { FileObjectDTO } from '../dtos/fileobject.dto'
import { RecordDTO } from '../dtos/record.dto'
import { FileDTO } from '../dtos/file.dto'

import { ImageKey, Buckets } from '../common/types'
import { TMP_DIR, AVATAR_SIZES, AVATAR_FORMAT } from '../common/constants'
import { AssetService } from '../asset/asset.service'
import { NotFoundException } from '@nestjs/common'

type Location = 'MINIO' | 'LOCAL'

@Processor('QUEUE')
export class TaskProcessor {
  constructor (
    private readonly minioService: MinioService,
    private readonly userService: UserService,
    private readonly fileService: FileService,
    private readonly assetService: AssetService
  ) {}

  @OnQueueActive()
  onActive (job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data `,
      job.data
    )
  }

  @OnQueueCompleted()
  onCompleted (job: Job) {
    console.log(`Completed job ${job.id} of type ${job.name}.`)
  }

  @Process('uploads')
  async handleUploads (job: Job) {
    // Get Data from s3 record
    const record = new RecordDTO(job.data)

    switch (record.uploadType) {
      case 'file':
        try {
          console.log(`File found in job ${job.id}`)

          const fileObject: FileObjectDTO = await this.hashAndSizeAndCheckExists(
            'MINIO',
            'uploads',
            'cas',
            record.key,
            record.size
          )

          if (fileObject == null) break

          await this.minioService.copyObject(
            'cas',
            fileObject.sha256,
            `/uploads/${record.key}`,
            record.eTag
          )
        } catch (error) {
          console.error(error)

          // Retry the Job
          await job.retry()
        }

        break
      case 'avatar':
        try {
          console.log(`Avatar found in job ${job.id}`)

          // Create a new assetId (We can remove this if we create the asset before the upload)
          const asset = await this.assetService.insertAsset(
            record.userId,
            `User ${record.userId} Avatar`,
            'avatar',
            'public'
          )
          record.assetId = asset.id

          const originalFile = resolve(TMP_DIR, record.key)

          console.log(`Downloading avatar ${record.key}...`)
          const downloaded = await this.minioService.getObject(
            'uploads',
            record.key,
            originalFile
          )

          if (!downloaded) { throw new NotFoundException(`Avatar ${record.key} download failed`) }

          const fileObject: FileObjectDTO = await this.hashAndSizeAndCheckExists(
            'LOCAL',
            'public',
            'public',
            originalFile,
            record.size
          )

          if (fileObject == null) break

          console.log(`Upload image ${record.key} as ${fileObject.sha256}...`)
          const fileUploaded = await this.minioService.uploadObject(
            'public',
            fileObject.sha256,
            originalFile,
            { ...record.metaData }
          )

          if (!fileUploaded) { throw new Error(`Avatar ${record.key} upload failed`) }

          for (const size of Object.values(AVATAR_SIZES)) {
            record.fileDimension = size
            record.fileExtension = AVATAR_FORMAT
            record.fileName = record.buildFileName

            let targetPath = resolve(TMP_DIR, record.fileName)

            console.log(
              `Resize image ${record.key} to ${record.fileDimension}...`
            )

            const info = await this.fileService.resizePicture(
              originalFile,
              targetPath,
              record.fileDimension
            )
            if (info == null) {
              console.error(
                `Resizing ${originalFile} to ${size} px failed. The original file will be used`
              )
              targetPath = originalFile
            }

            const fileObject: FileObjectDTO = await this.hashAndSizeAndCheckExists(
              'LOCAL',
              'public',
              'public',
              targetPath
            )

            if (fileObject == null) continue

            console.log(`Upload ${fileObject.sha256} image to public ...`)

            await this.minioService.uploadObject(
              'public',
              fileObject.sha256,
              targetPath,
              {
                ...record.metaData,
                'X-Amz-Meta-File-Size': record.fileDimension
              }
            )
          }
        } catch (error) {
          console.error(error)

          if (record.assetId != null) { await this.assetService.removeAsset(record.assetId) }

          await job.retry()
        } finally {
          this.clearDir()
        }
        break
      default:
        break
    }
  }

  @Process('public')
  async handlePublic (job: Job) {
    const record = new RecordDTO(job.data)

    if (record.metaData == null) {
      console.error('Public Process requires user metadata')
      return
    }

    if (record.assetId == null) {
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
      const fileObject: FileObjectDTO = await this.minioService.hashAndSizeMinio(
        'public',
        record.key
      )

      if (record.size !== fileObject.size) {
        console.error('Size mismatch') // TODO We need an error here
      }

      file.fileobjectId = await this.fileService.insertFileObject(fileObject)

      if (file.fileobjectId == null) {
        // Remove file in cas/public bucket if we cannot create a fileobject
        return
      }

      console.log(`file object ${file.fileobjectId} added`)

      file.uploadedDatetime = new Date().toISOString()

      await this.fileService.insertFile(file)

      console.log(`File ${record.fileName} added`)

      if (record.fileDimension == null) {
        console.log(`File ${record.fileName} size not found`)
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
      await this.userService.updateUserAvatar(
        record.userId,
        record.assetId,
        image
      )
    } catch (error) {
      console.error(error)
      if (file.fileobjectId != null) {
        // Remove fileObject from db
      }

      // Delete object from CAS

      // Retry the Job
      await job.retry()
    }
  }

  @Process('cas')
  async handleCas (job: Job) {
    const record = new RecordDTO(job.data)

    if (record.assetId == null) {
      console.error('CAS Process requires an assetId')
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
      const fileObject: FileObjectDTO = await this.minioService.hashAndSizeMinio(
        'cas',
        record.key
      )
      if (record.size !== fileObject.size) {
        console.error('Size mismatch') // TODO We need an error here
      }

      file.fileobjectId = await this.fileService.insertFileObject(fileObject)

      if (file.fileobjectId == null) {
        // Remove file in cas/public bucket if we cannot create a fileobject
        return
      }

      file.uploadedDatetime = new Date().toISOString()
      await this.fileService.insertFile(file)
    } catch (error) {
      console.error(error)
      if (file.fileobjectId != null) {
        // Remove fileObject from db
      }

      // Delete object from CAS

      // Retry the Job
      await job.retry()
    }
  }

  // For LOCAL location orginalBucket is the same as the targetBucket
  private async hashAndSizeAndCheckExists (
    location: Location,
    originalBucket: Buckets,
    targetBucket: Buckets,
    file: string,
    size?: number
  ): Promise<FileObjectDTO> {
    const fileObject: FileObjectDTO =
      location === 'MINIO'
        ? await this.minioService.hashAndSizeMinio(originalBucket, file)
        : await FileObjectDTO.hashAndSizeFile(originalBucket, file)

    if (size != null && size !== fileObject.size) {
      console.error('Size mismatch')
    }

    const fileExistsInBucket = await this.minioService.fileExists(
      targetBucket,
      fileObject.sha256
    )

    if (fileExistsInBucket) {
      console.error(`File ${file} already exists in ${targetBucket} bucket`)
      return null
    }

    return fileObject
  }

  private clearDir (dir: string = TMP_DIR) {
    readdir(dir, (err, files) => {
      if (err != null) throw err

      for (const file of files) {
        unlink(join(TMP_DIR, file), (err) => {
          if (err != null) throw err
        })
      }
    })
  }
}
