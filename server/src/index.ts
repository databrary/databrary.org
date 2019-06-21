import * as express from 'express'
import { ApolloServer, gql } from 'apollo-server-express'
import * as casual from 'casual'
import * as config from 'config'
import * as passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import * as session from 'express-session'
// import { rule, shield, and, or, not } from 'graphql-shield'
import { AppModule } from './modules/index'

const mocks = {
  Person: () => ({
    name: casual.name,
    age: () => casual.integer(0, 120)
  })
}

const secret: String = config.get('sessionSecret')

const sessionConfig = {
  secret,
  cookie: {},
  resave: false, // TODO check this with the eventual store we choose
  saveUninitialized: false // TODO I think this is the GDPR-compliant option
}

const app = express()
app.use(session(sessionConfig))

passport.serializeUser((user, done) => {
  console.log('Serialize User')
  done(null, user)
})

passport.deserializeUser((id, done) => {
  console.log('Deserialize User')
  done(null, id)
})

passport.use(
  new LocalStrategy(
    {
      passReqToCallback : true
    },
    async (req, username, password, done) => {
      console.log('Local Strategy', username, password)
      // const hash = await getUserPassword.command({
      //   username: username
      // }, {
      //   knex: knex
      // })
      // const comparison = await bcryptCompare.command({
      //   text: password,
      //   hash
      // })
      // console.log(comparison)
      done(null, username)
    }
  )
)

app.use(passport.initialize())
app.use(passport.session())

const server = new ApolloServer({
  schema: AppModule.schema,
  context: session => session,
  mocks
})
server.applyMiddleware({ app })

const port: number = config.get('port')
app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`)
)
