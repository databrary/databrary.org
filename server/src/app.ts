import './config'
import * as _ from 'lodash'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import session from 'express-session'
import proxy from 'express-http-proxy'
import morgan from 'morgan'
import passport from 'passport'

import * as authController from './controllers/authController'
import * as webhooksController from './controllers/webhooksController'
import * as uploadController from './controllers/uploadController'

import { stream, sessionStore, isAuthenticated } from '@shared'

const app = express()

app.set('port', process.env.APP_PORT)

app.use(cors())
app.use(morgan('combined', {
  skip: (req, res) => { return res.statusCode === 304 },
  stream
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000 // TODO come up with a reasonable number here; this is a month in ms
  }
}))

app.use(passport.initialize())
app.use(passport.session())

// Auth Callbacks
app.use('/auth/databrary/callback',
          passport.authenticate('keycloak', { failureRedirect: '/login' }),
          authController.authCallback)
// Auth routes
app.use('/session', authController.getSession)
app.use('/login', authController.login)
app.use('/register', authController.register)
app.use('/logout', authController.logout)

// Upload routes
// TODO(Reda): Add isAuthenticated as middleware instead of checking in the route
app.use('/sign-upload', isAuthenticated, uploadController.signUpload)
app.use('/sign-avatar-upload', uploadController.signAvatarUpload)

// Webhooks routes
app.use('/auth/webhook', webhooksController.authWebhook)
// TODO(Reda): Add isAuthenticated as middleware instead of checking in the route
app.use('/webhooks/minio', webhooksController.minioWebhook)

app.use('/', proxy(process.env.APP_URL_PROXY))

export default app
