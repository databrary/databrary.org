import passport from 'passport'
import KcAdminClient from 'keycloak-admin'
import { Request, Response, NextFunction } from 'express'
import { Strategy as KeycloakStrategy } from 'passport-keycloak-oauth2-oidc'
import { getUserByAuthId, getUserByEmail, registerUser } from '@units'
import { getGravatars, getAvatars, getAvatarAsset } from '@utils'
import { logger } from '@shared'

const kcAdminClient = new KcAdminClient({
  baseUrl: `http://${process.env.KEYCLOAK_ENDPOINT}:${process.env.KEYCLOAK_PORT}/auth`,
  realmName: 'master'
})

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((id, done) => {
  // TODO Should I put database logic here? How many times would this be called? Memoized somehow?
  done(null, id)
})

passport.use(
  'keycloak',
  new KeycloakStrategy({
    clientID: process.env.KEYCLOAK_CLIENT_ID,
    realm: process.env.KEYCLOAK_REALM,
    publicClient: 'false',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    sslRequired: 'none',
    authServerURL: process.env.AUTH_SERVER_URL,
    callbackURL: process.env.AUTH_CALLBACK_URL
  }, async (accesseToken, refreshToken, profile, done) => {
    // register user if found in keycloak and not found in db
    logger.debug(`Profile ${JSON.stringify(profile)}`)
    try {
      let user = await getUserByAuthId(
                    profile.id)

      // If the user is null, register the user in the database
      if (user === null) {
        user = await registerUser(
          profile.id,
          profile.email,
          profile._json.given_name,
          profile._json.family_name,
          [profile.email]
        )

        logger.debug(`Registered User ${JSON.stringify(user)}`)
      }

      if (user) {
        // persisting dbId value with profile
        profile.dbId = user.id
        // We fetch the avatar and save it in the profile
        const avatarAsset = await getAvatarAsset(profile.dbId)
        profile['useGravatar'] = user.useGravatar
        profile['gravatarURL'] = getGravatars(profile['email'])
        profile['avatarURL'] = await getAvatars('cas', avatarAsset.avatar)
        done(null, profile)
      } else {
        done(null, false, { message: 'Cannot log in user.' })
      }
    } catch (error) {
      logger.error(error)
      done(null, false)
    }
  }
))

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

export const resetKeycloakPassword = async (userId, newPassword) => {
  await kcAdminClient.auth({
    username: process.env.KEYCLOAK_USERNAME,
    password: process.env.KEYCLOAK_PASSWORD,
    clientId: 'admin-cli',
    grantType: 'password'
  })

  await kcAdminClient.users.resetPassword({
    realm: process.env.KEYCLOAK_REALM,
    id: userId,
    credential: {
      temporary: false,
      type: 'password',
      value: newPassword
    }
  })

}

export const registerTestUser = async () => {
  let user = await getUserByEmail(
    process.env.DUMMY_USER_EMAIL
  )

  // If the user is null, register the user in the database
  if (user === null && process.env.USE_KEYCLOAK === 'true') {

    await kcAdminClient.auth({
      username: process.env.KEYCLOAK_USERNAME,
      password: process.env.KEYCLOAK_PASSWORD,
      clientId: 'admin-cli',
      grantType: 'password'
    })

    const keycloakUser = await kcAdminClient.users.create({
      realm: process.env.KEYCLOAK_REALM,
      username: process.env.DUMMY_USER_EMAIL,
      email: process.env.DUMMY_USER_EMAIL,
      enabled: true,
      emailVerified: true,
      firstName: 'Test',
      lastName: 'Testerson'
    })

    await kcAdminClient.users.resetPassword({
      realm: process.env.KEYCLOAK_REALM,
      id: keycloakUser.id,
      credential: {
        temporary: false,
        type: 'password',
        value: 'test'
      }
    })
  }
}

export const loginTestUser = async () => {
  try {
    let user = await getUserByAuthId(
      process.env.DUMMY_USER_AUTH_SERVER_ID
    )

    // If the user is null, register the user in the database
    if (user === null) {
      user = await registerUser(
        process.env.DUMMY_USER_AUTH_SERVER_ID,
        process.env.DUMMY_USER_EMAIL,
        'Test',
        'Testerson',
        [process.env.DUMMY_USER_EMAIL]
      )

      logger.debug(`Registered Dummy User ${JSON.stringify(user)}`)
    } else {
      logger.debug(`Found Dummy User ${JSON.stringify(user)} in Database`)
    }

    if (user) {
      // change id property to dbId
      user['dbId'] = user['id']
      return user
    } else {
      logger.error(`Cannot login and/or register user`)
    }
  } catch (error) {
    logger.error(error)
  }
}
