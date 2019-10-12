import express from 'express'

export function routes (app: any, passport: any) {
  app.get('/', (req: express.Request, res: express.Response) => {
    console.log('Home', req.session)
    // console.log(req.session.passport.user)
    res.send(`<html><body><a href="/login">login</a> | <a href="/logout">logout</a></body></html>`)
  })
}
