import { Request, Response, NextFunction } from 'express'
import { uuid } from '@utils'
import { logger, loginTestUser } from '@shared'

const keycloakRealm = process.env.KEYCLOAK_REALM
const keycloakEndpoint = process.env.KEYCLOAK_ENDPOINT
const keycloakPort = process.env.KEYCLOAK_PORT
const keycloak = process.env.USE_KEYCLOAK === 'true'

export const login = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    if (keycloak) {
      // Callback is set in KeycloakStrategy
      return res.redirect('/auth/keycloak')
    } else {
      const user = await loginTestUser()
      if (user) {
        req.logIn(user , (err) => {
          if (err) { return next(err) }
        })
      }
    }
  }
  res.redirect('/')
}

export const register = (req: Request, res: Response) => {
  let url = process.env.AUTH_CALLBACK_URL
  if (!req.user) {
    const callbackUri = process.env.AUTH_CALLBACK_URL
    if (keycloak) {
      url = `http://${keycloakEndpoint}:${keycloakPort}/auth/realms/${keycloakRealm}/protocol/openid-connect/registrations?client_id=client&state=${uuid()}response_mode=fragment&response_type=code&redirect_uri=${callbackUri}`
    }
  }
  res.redirect(url)
}

export const logout = (req: Request, res: Response) => {
  let url = process.env.APP_BASE_URL
  if (keycloak) {
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

export const getSession = (req: Request, res: Response) => {
  let response = { 'sessionID': req.sessionID }
  if (req.user) {
    // user found.
    response['dbId'] = req.user['dbId']
  }
  res.json(response)
}

export const authCallback = (req: Request, res: Response) => {
  if (req.user) {
    return res.redirect('/')
  }
}

export const authDatabraryCallback = (req: Request, res: Response) => {
  if (req.user) {
    return res.redirect('/')
  }
}
