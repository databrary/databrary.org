import { Controller, Session, Res, Get } from '@nestjs/common'
@Controller('hasura')
export class HasuraController {
  @Get('auth')
  async hasura (@Session() { user: { id } }, @Res() res) {
    if (id == null) return res.status(401).send()

    res.json({
      'X-Hasura-Role': 'user',
      'X-Hasura-User-Id': id.toString()
    })
  }
}
