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
import { routes as addHomeRoutes } from './routes/home'

import config from 'config'
const appPort: number = config.get('appPort')
const keycloakPort: number = config.get('keycloak.port')
const keycloakRealm: string = config.get('keycloak.realm')
const keycloakClientId: string = config.get('keycloak.client.id')
const keycloakClientSecret: string = config.get('keycloak.client.secret')

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
    clientID: keycloakClientId,
    realm: keycloakRealm,
    publicClient: 'false',
    clientSecret: keycloakClientSecret,
    sslRequired: 'none',
    authServerURL: `http://localhost:${keycloakPort}/auth`,
    callbackURL: `http://localhost:${appPort}/auth/databrary/callback`
  },
  function (accesseToken, refreshToken, profile, done) {
    done(null, profile)
  }
))

// addHomeRoutes(app, passport)

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

    addAuthRoutes(app, passport, sessionMiddleware)
    addHasuraRoutes(app, sessionStore)
    app.use('/', proxy('http://localhost:8080/'))

    app.listen({ port: appPort }, () =>
      console.log(`Server ready at http://localhost:${appPort}/`)
    )
  } catch (err) {
    console.log(err)
  }
}

// tslint:disable-next-line: no-floating-promises
main()
