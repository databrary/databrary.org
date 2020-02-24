import express from 'express'
import { getUserByAuthId, registerUser } from '@units'
import { uuid } from '@utils'
import { logger } from '@shared'

const keycloakRealm = process.env.KEYCLOAK_REALM
const keycloakEndpoint = process.env.KEYCLOAK_ENDPOINT
const keycloakPort = process.env.KEYCLOAK_PORT

export function routes (app: any, passport: any, session: any, keycloak: boolean) {

  app.get('/auth/databrary',
    passport.authenticate('keycloak')
  )

  // TODO(Reda): remove user registration from /auth/databrary/callback
  if (keycloak === false) {
    app.get('/auth/databrary/callback',
      session,
      async (req: express.Request, res: express.Response) => {
        let user = await getUserByAuthId(
          process.env.DUMMY_USER_AUTH_SERVER_ID
        )
        logger.debug(`User ${JSON.stringify(user)}`)
        // If the user is null, register the user in the database
        if (user === null) {
          user = await registerUser(
            process.env.DUMMY_USER_AUTH_SERVER_ID,
            process.env.DUMMY_USER_EMAIL
          )
          logger.debug(`Register User ${JSON.stringify(user)}`)
        }
        req.session.dbId = user.id
        req.session.authServerId = user.auth_server_id
        req.session.emailPrimary = user.email_primary
        req.session.displayFullName = process.env.DUMMY_USER_FULL_NAME
        logger.debug(`Session ${JSON.stringify(req.session)}`)
        res.redirect(process.env.APP_BASE_URL)
      }
    )
  } else {
    app.get('/auth/databrary/callback',
      session,
      passport.authenticate('keycloak', { failureRedirect: '/login' }),
      async (req: express.Request, res: express.Response) => {
        if (req.user) {
          res.redirect('/')
        }
      }
    )
  }

  app.get('/session',
    session,
    (req: express.Request, res: express.Response) => {
      let response = { 'sessionID': req.sessionID }
      if (req.user) {
        // user found.
        response['dbId'] = req.user['dbId']
      }
      res.json(response)
    }
  )
  app.get('/login',
    session,
    (req: express.Request, res: express.Response) => {
      if (!req.user) {
        const redirectUri = req.query && req.query.redirect ? req.query.redirect : process.env.APP_BASE_URL
        const callbackUri = process.env.AUTH_CALLBACK_URL
        let url = process.env.AUTH_CALLBACK_URL
        if (keycloak === true) {
          url = `http://${keycloakEndpoint}:${keycloakPort}/auth/realms/${keycloakRealm}/protocol/openid-connect/auth?client_id=client&state=${uuid()}response_mode=fragment&response_type=code&redirect_uri=${callbackUri}`
        }
        return res.redirect(url)
      }
      res.redirect('/')
    }
  )

  // TODO(Reda): inconsistency between keycloak and hasura when an error happens during the redirect (invalid url or url not added the realm)
  app.get('/register',
    (req: express.Request, res: express.Response) => {
      let url = process.env.AUTH_CALLBACK_URL
      if (!req.user) {
        const callbackUri = process.env.AUTH_CALLBACK_URL
        if (keycloak === true) {
          url = `http://${keycloakEndpoint}:${keycloakPort}/auth/realms/${keycloakRealm}/protocol/openid-connect/registrations?client_id=client&state=${uuid()}response_mode=fragment&response_type=code&redirect_uri=${callbackUri}`
        }
      }
      res.redirect(url)
    }
  )

  app.get('/logout',
    session,
    (req: express.Request, res: express.Response) => {
      let url = process.env.APP_BASE_URL
      if (keycloak === true) {
        url = `http://${keycloakEndpoint}:${keycloakPort}/auth/realms/${keycloakRealm}/protocol/openid-connect/logout?redirect_uri=http://localhost:8000`
      }
      req.logout()
      req.session.destroy((err) => {
        if (err) {
          logger.error('Error destroying session')
        }
        res.clearCookie(process.env.SESSION_NAME) // Fixes session-file-store errors
        res.redirect(url)
      })
    }
  )
}
