import './config'
import * as _ from 'lodash'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import session from 'express-session'
import proxy from 'express-http-proxy'
import passport from 'passport'
import morgan from 'morgan'
import { Strategy as KeycloakStrategy } from 'passport-keycloak-oauth2-oidc'

import { routes as addAuthRoutes } from './routes/auth'
import { routes as addWebhooksRoutes } from './routes/webhooks'
import { routes as addUploadRoutes } from './routes/upload'

import { stream ,logger, sessionStore } from '@shared'
import { getUser, registerUser } from '@units'


// API keys and Passport configuration

const app = express()

app.set('port', process.env.APP_PORT)

app.use(cors())
app.use(morgan('combined', {
  skip: (req, res) => { return res.statusCode === 304 },
  stream
}))
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
    async (req: any, accesseToken, refreshToken, profile, done) => {
      // register user if found in keycloak and not found in db
      let user = await getUser(
        profile.id
      )
      // If the user is null, register the user in the database
      if (user === null) {
        user = await registerUser(
          profile.id,
          profile.email
        )

        logger.debug(`Register User ${JSON.stringify(user)}`)
      }
      // persisting dbId value with profile
      profile.dbId = user.id
      done(null, profile)
    }
))
 
addAuthRoutes(app, passport, sessionMiddleware, JSON.parse(process.env.USE_KEYCLOAK))
addWebhooksRoutes(app, sessionStore, sessionMiddleware)
addUploadRoutes(app, sessionMiddleware)

app.use('/', proxy(process.env.APP_URL_PROXY))

export default app
