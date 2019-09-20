import * as _ from 'lodash'
import express from 'express'
import session from 'express-session'
import passport from 'passport'
import { ApolloServer, gql } from 'apollo-server-express'
import { mergeSchemaList } from './mergeSchemaList'
import { AppModule } from './modules'

import config from 'config'
import Keycloak from 'keycloak-connect'
import OAuth2Strategy from 'passport-oauth2'
import { access } from 'fs'
// import * as superagent from 'superagent'
// "lib": ["es2015", "es2016", "dom", "es2017", "es6", "es5"],

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

const memoryStore = new session.MemoryStore()

const app = express()
app.use(session({
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore
}))
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  console.log(id)
  done(null, id)
})

passport.use(new OAuth2Strategy(
  {
    authorizationURL: 'http://localhost:8001/auth/realms/databrary.org/protocol/openid-connect/auth',
    tokenURL: 'http://localhost:8001/auth/realms/databrary.org/protocol/openid-connect/token',
    clientID: 'client',
    clientSecret: 'd527f007-35d8-4956-a904-6165460714d9',
    callbackURL: 'http://localhost:8000/auth/databrary/callback'
  },
  async (accessToken: any, refreshToken: any, profile: any, cb: any) => {
    const userInfo = await keycloak.grantManager.userInfo(accessToken)
    cb(null, userInfo)
  }
))

let keycloak = new Keycloak({ store: memoryStore }, {
  'realm': 'databrary.org',
  'auth-server-url': 'http://localhost:8001/auth/databrary/callback',
  'ssl-required': 'none',
  'resource': 'client',
  'credentials': {
    'secret': 'd527f007-35d8-4956-a904-6165460714d9'
  },
  'confidential-port': 0
})

app.get('/', (req: express.Request, res: express.Response) => {
  res.send(`<html><body><a href="/login">login</a> | <a href="/logout">logout</a></body></html>`)
})

app.get('/auth/databrary', passport.authenticate('oauth2'))

app.get('/auth/databrary/callback',
  passport.authenticate('oauth2', { failureRedirect: '/login' }),
  (req, res) => {
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

app.get('/project', passport.authenticate('oauth2'), (req: express.Request, res: express.Response) => {
  res.send(`<html><body>project</body></html>`)
})

// app.get('/check-sso', keycloak.checkSso(), () => {
//   console.log('checked')
// })

// app.get('/auth', async (req: express.Request, res: express.Response) => {
//   req.session.auth_redirect_uri = 'http://localhost:8000/auth'
//   const tokenResponse = await keycloak.grantManager.obtainFromCode(req, req.query.code)
//   console.log(tokenResponse.access_token)
//   res.redirect('/')
// })

// const typeDefs = gql`
//   type Query {
//     project: String
//   }
// `

// const resolvers = {
//   Query: {
//     project: (parent, args, context, data) => {
//       console.log(context)
//       return 'hi'
//     }
//   }
// }

async function main () {

  const schema = await mergeSchemaList([
    'http://localhost:8002/v1/graphql',
    {
      typeDefs: AppModule.typeDefs,
      resolvers: AppModule.resolvers
    }
  ])

  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => {
      return {
        userId: 1
      }
    }
  })

  server.applyMiddleware({ app, path: '/v1/graphql' })

  const port: number = config.get('appPort')
  app.listen({ port }, () =>
    console.log(`🚀 Server ready at http://localhost:${port}`)
  )
}

// tslint:disable-next-line: no-floating-promises
main()
