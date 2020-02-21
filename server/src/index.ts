import './config'
import * as _ from 'lodash'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import session from 'express-session'
import proxy from 'express-http-proxy'
import passport from 'passport'
import { Strategy as KeycloakStrategy } from 'passport-keycloak-oauth2-oidc'

import { routes as addAuthRoutes } from './routes/auth'
import { routes as addWebhooksRoutes } from './routes/webhooks'
import { routes as addUploadRoutes } from './routes/upload'

import { setup as queueSetup } from './queue'
import { logger, sessionStore } from '@shared'

// API keys and Passport configuration

const app = express()

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
let sessionMiddleware = session({
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000 // TODO come up with a reasonable number here; this is a month in ms
  }
})
app.use(sessionMiddleware)
// app.use(session({
//   name: process.env.SESSION_NAME,
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: true,
//   store: sessionStore
// }))
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
    clientID: process.env.KEYCLOAK_CLIENT_ID,
    realm: process.env.KEYCLOAK_REALM,
    publicClient: 'false',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    sslRequired: 'none',
    authServerURL: process.env.AUTH_SERVER_URL,
    callbackURL: process.env.AUTH_CALLBACK_URL
  },
  function (accesseToken, refreshToken, profile, done) {
    // This will get called each time a user authenticate through keycloak
    const user = Object.assign({}, profile)
    console.log(`Passport user ${user}`)
    done(null, profile)
  }
))

// export default app

async function main () {
  try {
    addAuthRoutes(app, passport, sessionMiddleware, JSON.parse(process.env.USE_KEYCLOAK))
    addWebhooksRoutes(app, sessionStore, sessionMiddleware)
    addUploadRoutes(app, sessionMiddleware)

    app.use('/', proxy(process.env.APP_URL_PROXY))

    // Auth callback
    await queueSetup()

    app.listen({ port: process.env.APP_PORT }, () =>
      logger.info(`Server ready at ${process.env.APP_BASE_URL}`)
    )
  } catch (err) {
    logger.error(err)
  }
}

// tslint:disable-next-line: no-floating-promises
main()
