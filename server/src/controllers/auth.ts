import * as _ from 'lodash'
import { Request, Response, NextFunction } from 'express'
import { uuid, getAvatars, getGravatars, getAvatarAsset } from '@utils'
import { logger, loginTestUser, registerTestUser, resetKeycloakPassword } from '@shared'
import { check, validationResult } from 'express-validator'
import { dev } from '../config'

const keycloakRealm = process.env.KEYCLOAK_REALM
const keycloakEndpoint = process.env.KEYCLOAK_ENDPOINT
const keycloakPort = process.env.KEYCLOAK_PORT
const keycloak = process.env.USE_KEYCLOAK === 'true'

export const login = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    if (keycloak) {
      if (dev) {
        await registerTestUser()
      }

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

export const getSession = async (req: Request, res: Response) => {
  if (req.session) {
    if (req.session.passport) {
      let session = {
        'dbId': req.session.passport.user['dbId']
      }

      // We check if the user update the avatar and we update our urls
      const avatarAsset = await getAvatarAsset(req.session.passport.user['dbId'])
      req.session.passport.user['avatarId'] = avatarAsset.avatar.id
      req.session.passport.user['avatarURL'] = await getAvatars('cas', avatarAsset.avatar)

      if (_.get(req.session.passport.user, 'avatarURL')) {
        session['avatarURL'] = req.session.passport.user['avatarURL']
      }

      if (_.get(req.session.passport.user, 'gravatarURL')) {
        session['gravatarURL'] = req.session.passport.user['gravatarURL']
      } else {
        req.session.passport.user['gravatarURL'] = getGravatars(req.session.passport.user['email'])
      }
      session['useGravatar'] = avatarAsset.useGravatar

      return res.json(session)
    } else {
      res.status(200).send(`User not found.`)
    }
  } else {
    res.status(400).send(`Session Not found.`)
  }
}

export const authCallback = async (req: Request, res: Response) => {
  if (req.session.passport) {
    // return res.status(200).send('Successfully logged in')
    return res.redirect('/')
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  if (req.session) {
    try {
      const user = req.session.passport.user
      if (user['id']) {
        await check('password-confirm', 'Passwords must match.').equals(req.body['password-new']).run(req)

        const errors = validationResult(req)

        if (!errors.isEmpty()) {
          return res.status(401).send('Cannot update password')
        }

        await resetKeycloakPassword(user['id'], req.body['password-new'])
        return res.send(200)
      } else {
        res.redirect('/login')
      }
    } catch (error) {
      logger.error(error)
      return res.status(400).send('error')
    }
  }
}
