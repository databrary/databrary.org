import express from 'express'

export function routes (app: any, sessionStore: any) {
  app.get('/auth/webhook',
    (req: express.Request, res: express.Response) => {
      const sessionId = req.get('sessionID')
      sessionStore.get(sessionId, (err, data) => {
        console.log(sessionId, data)
        if (data.dbId) {
          res.json({
            'X-Hasura-Admin-Secret': 'mysecret',
            'X-Hasura-Role': 'user',
            'X-Hasura-User-Id': `${data.dbId}`
          })
        } else {
          res.json({
            'X-Hasura-Admin-Secret': 'mysecret',
            'X-Hasura-Role': 'anonymous_user'
          })
        }
      })
    }
  )
}
