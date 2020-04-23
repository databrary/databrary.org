import './config'
import * as _ from 'lodash'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import session from 'express-session'
import proxy from 'express-http-proxy'
import morgan from 'morgan'
import passport from 'passport'
import redis from 'redis'
import redisStore from 'connect-redis'

import * as authController from './controllers/auth'
import * as webhooksController from './controllers/webhooks'
import * as uploadController from './controllers/upload'

import { stream, isAuthenticated } from '@shared'

const app = express()

// Set App Port
app.set('port', process.env.APP_PORT)

// Set App cors
app.use(cors({
  credentials: true,
  origin: "http://localhost:8000"
}))
// app.use(cors())

// Set Redis Store and session
const RedisStore = redisStore(session)
let store = new RedisStore({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  client: redis.createClient(),
  ttl: process.env.REDIS_TTL
})

let sess = {
  name: process.env.SESSION_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000 // TODO come up with a reasonable number here; this is a month in ms
  }
}

// trust first proxy in production, this needed when using secure cookie
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie['secure'] = true // serve secure cookies
}

// Cobine Morgan logger with winston
app.use(morgan('combined', {
  skip: (req, res) => { return res.statusCode === 304 },
  stream
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Set session and passport middleware, Note that passport.session() is optional
app.use(session(sess))
app.use(passport.initialize())
app.use(passport.session())

// Auth Callbacks
app.get('/auth/keycloak',
  passport.authenticate('keycloak', { scope: ['profile'] }))
app.get('/auth/keycloak/callback',
          passport.authenticate('keycloak', { failureRedirect: '/login' }),
          authController.authCallback)

// Auth routes
app.get('/session', authController.getSession)
app.get('/login', authController.login)
app.get('/register', authController.register)
app.get('/logout', authController.logout)
app.post('/password', isAuthenticated, authController.resetPassword)

// Upload routes
app.post('/sign-upload', isAuthenticated, uploadController.signUpload)

// Webhooks routes
app.get('/auth/webhook', isAuthenticated, webhooksController.authWebhook)
app.post('/user/webhook', webhooksController.userWebhook)
app.post('/webhooks/minio', webhooksController.minioWebhook)

app.use('/', proxy(process.env.APP_URL_PROXY))

export default app
