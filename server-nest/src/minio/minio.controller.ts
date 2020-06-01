import { Controller, Post, Request, Session, Res } from '@nestjs/common'
import { MinioService } from './minio.service'

@Controller('minio')
export class MinioController {
  constructor (
    private readonly minioService: MinioService
  ) {}

  @Post('webhook')
  async webhook (@Request() { body: { Records } }, @Res() res) {
    if (!Records) return res.status(201).send() // need to change the response status

    for (const record of Records) {
      const { s3: { object, bucket: { name } } } = record
      if (!name) continue
      if (!object) continue

      await this.minioService.addJob(name, object)
    }

    res.status(201).send()
  }

  @Post('sign-upload')
  async signedUpload (
  @Res() res,
    @Request() { body: { contentType, filename, uploadType, format, assetId } },
    @Session() { user: { id } }
  ) {
    try {
      const bucketName = 'uploads'

      const bucketFound = await this.minioService.bucketExists(bucketName)

      if (bucketFound) {
        // Send signed url
        this.minioService.client.presignedPutObject(
          bucketName,
          encodeURIComponent(filename),
          1000,
          function (err, presignedUrl) {
            if (err) return console.log(err)
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
