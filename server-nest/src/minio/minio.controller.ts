import { Controller, Post, Request, Session, Res } from '@nestjs/common'
import { MinioService } from './minio.service'
import { Buckets } from '../common/types'
import { UserDTO } from '../dtos/user.dto'

@Controller('minio')
export class MinioController {
  constructor (private readonly minioService: MinioService) {}

  @Post('webhook')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async webhook (@Request() { body: { Records } }, @Res() res): Promise<void> {
    if (Records == null) return res.status(201).send() // need to change the response status

    for (const record of Records) {
      const {
        s3: {
          object,
          bucket: { name }
        }
      } = record
      if (name == null) continue
      if (object == null) continue

      await this.minioService.addJob(name, object)
    }

    res.status(201).send()
  }

  @Post('sign-upload')
  async signedUpload (
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @Res() res, @Request() { body: { contentType, filename, uploadType, format, assetId } },
      @Session() { user: { id } }: { user: UserDTO, id: number }
  ): Promise<void> {
    try {
      const bucketName: Buckets = 'uploads'

      const bucketFound = await this.minioService.bucketExists(bucketName)

      if (bucketFound) {
        // Send signed url
        this.minioService.client.presignedPutObject(
          bucketName,
          encodeURIComponent(filename),
          1000,
          function (err, presignedUrl) {
            if (err != null) return console.log(err)
            res.json({
              url: presignedUrl,
              method: 'put',
              fields: [],
              headers: {
                'content-type': contentType,
                'x-amz-meta-user-id': id,
                'x-amz-meta-file-extension': format,
                'x-amz-meta-file-name': filename,
                'x-amz-meta-upload-type': uploadType,
                'x-amz-meta-asset-id': assetId
              }
            })
          }
        )
      }
    } catch (error) {
      console.error(error)
    }
  }
}
