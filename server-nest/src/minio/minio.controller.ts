import { Controller, Get, Post, Request, Session, Res } from '@nestjs/common'
import { MinioService } from './minio.service'

@Controller('minio')
export class MinioController {
  constructor (
    private readonly minioService: MinioService
  ) {}

  @Post('webhook')
  async webhook (@Request() { body: { Records }}, @Res() res) {
    if (!Records) return res.status(201).send() // need to change the response status

    for (const record of Records) {
        const { s3: { object }} = record
        if (!object) continue
        await this.minioService.addJob(object)
    }

    res.status(201).send()
  }

  @Post('sign-upload')
  async signedUpload (
    @Res() res,
    @Request() { body: { contentType, filename } },
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
                'x-amz-meta-user-id': id
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
