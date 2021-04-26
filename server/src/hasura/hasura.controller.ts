import { Controller, Session, Res, Get } from '@nestjs/common'

@Controller('hasura')
export class HasuraController {
  @Get('auth')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async hasura (@Session() { user }, @Res() res): Promise<void> {
    if (user == null) return res.status(401).send()

    res.json({
      'X-Hasura-Role': 'user',
      'X-Hasura-User-Id': user.id.toString()
    })
  }
}
