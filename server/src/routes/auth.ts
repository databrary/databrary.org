import express from 'express'

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

export function routes (app: any, keycloak: any, passport: any) {
  app.get('/auth/databrary', passport.authenticate('oauth2'))

  app.get('/auth/databrary/callback',
    passport.authenticate('oauth2', { failureRedirect: '/login' }),
    (req: express.Request, res: express.Response) => {
      res.redirect('/')
    }
  )

  app.get('/login', (req: express.Request, res: express.Response) => {
    const url = keycloak.loginUrl(uuid(), 'http://localhost:8000/auth/databrary/callback')
    res.redirect(url)
  })

  app.get('/logout', (req: express.Request, res: express.Response) => {
    const url = keycloak.logoutUrl('http://localhost:8000')
    res.redirect(url)
  })
}