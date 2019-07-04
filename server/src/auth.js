import * as passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import * as session from 'express-session'
// import { rule, shield, and, or, not } from 'graphql-shield'
import { AppModule } from './modules/index'

// const secret: String = config.get('sessionSecret')

// const sessionConfig = {
//   secret,
//   cookie: {},
//   resave: false, // TODO check this with the eventual store we choose
//   saveUninitialized: false // TODO I think this is the GDPR-compliant option
// }

// app.use(session(sessionConfig))

// passport.serializeUser((user, done) => {
//   console.log('Serialize User')
//   done(null, user)
// })

// passport.deserializeUser((id, done) => {
//   console.log('Deserialize User')
//   done(null, id)
// })

// passport.use(
//   new LocalStrategy(
//     {
//       passReqToCallback : true
//     },
//     async (req, username, password, done) => {
//       console.log('Local Strategy', username, password)
//       // const hash = await getUserPassword.command({
//       //   username: username
//       // }, {
//       //   knex: knex
//       // })
//       // const comparison = await bcryptCompare.command({
//       //   text: password,
//       //   hash
//       // })
//       // console.log(comparison)
//       done(null, username)
//     }
//   )
// )

// app.use(passport.initialize())
// app.use(passport.session())