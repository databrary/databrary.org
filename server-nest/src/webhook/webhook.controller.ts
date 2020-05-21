import { Controller, Get, Session, Res } from '@nestjs/common';

@Controller('webhook')
export class WebhookController {

    @Get('auth')
    async hasura(@Session() { user: { id }}, @Res() res) {
      if (!id) return res.status(401).send()
      
      res.json({
        'X-Hasura-Role': 'user',
        'X-Hasura-User-Id': `${id}`
      })
    }
}
