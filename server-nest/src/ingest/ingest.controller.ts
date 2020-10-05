import { Controller, Post, Request, Res, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { IngestService } from './ingest.service'

@Controller('ingest')
export class IngestController {
  constructor (
    private readonly ingestService: IngestService
  ) {}

  @Post('projects')
  @UseInterceptors(FileInterceptor('file'))
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async ingestProjects (@UploadedFile() file, @Request() req, @Res() res): Promise<void> {
    const result = this.ingestService.ingestProjects()
    console.log('Users ingest succeded!', result)
    result.catch((error) => {
      console.log(error)
    })
    res.status(200).send()
  }
}
