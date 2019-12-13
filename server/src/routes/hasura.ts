import express from 'express'

export function routes (app: any, sessionStore: any) {
  app.get('/auth/webhook',
    (req: express.Request, res: express.Response) => {
      const sessionId = req.get('sessionID')
      console.log(`route: /auth/webhook`)
      sessionStore.get(sessionId, (err, data) => {
        if (data.dbId) {
          console.log(`route: /auth/webhook | user`)
          res.json({
            'X-Hasura-Admin-Secret': process.env.HASURA_SECRET,
            'X-Hasura-Role': 'user',
            'X-Hasura-User-Id': `${data.dbId}`
          })
        } else {
          console.log(`route: /auth/webhook | anonymous_user`)
          res.json({
            'X-Hasura-Admin-Secret': process.env.HASURA_SECRET,
            'X-Hasura-Role': 'anonymous_user'
          })
        }
      })
    }
  )
}
