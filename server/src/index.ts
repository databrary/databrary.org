import * as _ from 'lodash'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import session from 'express-session'
import FileStoreSession from 'session-file-store'
// import proxy from 'http-proxy-middleware'
import proxy from 'express-http-proxy'
import passport from 'passport'
import { ApolloServer } from 'apollo-server-express'
import { mergeSchemaList } from './utils/mergeSchemaList'
import { AppModule } from './modules'

import { Strategy as KeycloakStrategy } from 'passport-keycloak-oauth2-oidc'

import { routes as addAuthRoutes } from './routes/auth'
import { routes as addHasuraRoutes } from './routes/hasura'

import {
  USE_KEYCLOAK,
  APP_PORT,
  KEYCLOAK_PORT,
  KEYCLOAK_REALM,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_CLIENT_SECRET
} from './config'

// const memoryStore = new session.MemoryStore()

const app = express()

app.use(cors())

const FileStore = FileStoreSession(session)
const sessionStore = new FileStore({})

const sessionMiddleware = session({
  name: 'localhost',
  secret: 'mySecret',
  resave: false,
  saveUninitialized: true,
  store: sessionStore
})

app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  // TODO Should I put database logic here? How many times would this be called? Memoized somehow?
  done(null, id)
})

passport.use(
  new KeycloakStrategy({
    clientID: KEYCLOAK_CLIENT_ID,
    realm: KEYCLOAK_REALM,
    publicClient: 'false',
    clientSecret: KEYCLOAK_CLIENT_SECRET,
    sslRequired: 'none',
    authServerURL: `http://localhost:${KEYCLOAK_PORT}/auth`,
    callbackURL: `http://localhost:${APP_PORT}/auth/databrary/callback`
  },
  function (accesseToken, refreshToken, profile, done) {
    done(null, profile)
  }
))

async function main () {
  try {
    app.use(bodyParser.json())

    // app.use('/v1/graphql', function (req, res, next) {
    //   console.log('Request Type:', req.originalUrl, req.method, req.body)
    //   next()
    // })

    const schema = await mergeSchemaList([
      // 'http://localhost:8002/v1/graphql',
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
      },
      playground: {
        settings: {
          'editor.theme': 'light'
        }
      }
    })

    server.applyMiddleware({ app, path: '/v1/graphql' })

    addAuthRoutes(app, passport, sessionMiddleware, USE_KEYCLOAK)
    addHasuraRoutes(app, sessionStore)
    app.use('/', proxy('http://localhost:8080/'))

    app.listen({ port: APP_PORT }, () =>
      console.log(`Server ready at http://localhost:${APP_PORT}/`)
    )
  } catch (err) {
    console.log(err)
  }
}

// tslint:disable-next-line: no-floating-promises
main()
