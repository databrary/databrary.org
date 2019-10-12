import express from 'express'
import getUser from '../units/getUser'
import registerUser from '../units/registerUser'

function uuid () {
  let s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'
  return s.join('')
}

export function routes (app: any, passport: any) {
  app.get('/auth/databrary', passport.authenticate('keycloak'))

  app.get('/auth/databrary/callback',
    passport.authenticate('keycloak', { failureRedirect: '/login' }),
    async (req: express.Request, res: express.Response) => {
      // Try to get the user based on the auth_server_id
      let user = await getUser(
        req.session.passport.user.id
      )
      // If the user is null, register the user in the database
      if (user === null) {
        user = await registerUser(
          req.session.passport.user.id,
          req.session.passport.user.email
        )
      }
      // Set session information based upon the user or registered user
      req.session.dbId = user.id
      req.session.authServerId = user.auth_server_id
      req.session.emailPrimary = user.email_primary
      req.session.displayFullName = user.display_full_name
      res.redirect('http://localhost:8000/')
    }
  )

  app.get('/session',
    (req: express.Request, res: express.Response) => {
      console.log(req.session)
      res.json(req.session)
    }
  )

  app.get('/login', (req: express.Request, res: express.Response) => {
    const redirectUri = req.query && req.query.redirect ? req.query.redirect : 'http://localhost:8000'
    const callbackUri = `http://localhost:8000/auth/databrary/callback`
    const url = `http://localhost:8001/auth/realms/databrary.org/protocol/openid-connect/auth?client_id=client&state=${uuid()}response_mode=fragment&response_type=code&redirect_uri=${callbackUri}`
    res.redirect(url)
  })

  app.get('/register', (req: express.Request, res: express.Response) => {
    const callbackUri = `http://localhost:8000/auth/databrary/callback`
    const url = `http://localhost:8001/auth/realms/databrary.org/protocol/openid-connect/registrations?client_id=client&state=${uuid()}response_mode=fragment&response_type=code&redirect_uri=${callbackUri}`
    res.redirect(url)
  })

  app.get('/logout', (req: express.Request, res: express.Response) => {
    const url = `http://localhost:8001/auth/realms/databrary.org/protocol/openid-connect/logout?redirect_uri=http://localhost:8000`
    req.session.destroy((err) => {
      if (err) {
        console.log('Error destroying session')
      }
      res.redirect(url)
    })
  })
}
