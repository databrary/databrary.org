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

import { routes as authRoutes } from './routes/auth'

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

authRoutes(app, keycloak, passport)

app.get('/project', passport.authenticate('oauth2'), (req: express.Request, res: express.Response) => {
  res.send(`<html><body>project</body></html>`)
})

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
