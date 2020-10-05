import { Controller, Session, Request, Res, Get, Post, Body } from '@nestjs/common'

@Controller('hasura')
export class HasuraController {
  @Get('auth')
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async hasura (@Session() { user }, @Res() res): Promise<unknown> {
    if (user == null) return res.status(401).send()

    res.json({
      'X-Hasura-Role': 'user',
      'X-Hasura-User-Id': user.id.toString()
    })
  }

  // TODO add events endpoint for hasura
}
