import { Controller, Post, Request, Res } from '@nestjs/common'
import { IngestService } from './ingest.service'

@Controller('ingest')
export class IngestController {
  constructor (
    private readonly ingestService: IngestService
  ) {}

  @Post('users')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async ingestUsers (@Request() { body }, @Res() res): Promise<void> {
    if (body == null) return res.status(400).send()
    if (!Array.isArray(body)) return res.status(400).send('users must be an array')

    const result = await this.ingestService.ingestUsers(body)
    console.log('Users ingest succeded!', result)
    res.status(200).send()
  }
}
