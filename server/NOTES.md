Hasura remote schema:
  docker.for.win.localhost

Keycloak
  https://github.com/jboss-dockerfiles/keycloak/blob/master/docker-compose-examples/keycloak-postgres.yml

Apereo
  https://github.com/apereo/cas
  https://apereo.github.io/2017/09/15/520rc3-release/

Sentry
  https://github.com/getsentry/onpremise/blob/master/docker-compose.yml
  https://github.com/BrunoScheufler/graphql-middleware-sentry

docker ps
docker-compose run postgres
docker exec -it databrary-server_postgres_1 psql -U postgres postgres
CREATE DATABASE keycloak
\q

Add
https://www.apollographql.com/docs/apollo-server/federation/implementing/
https://github.com/louie007/passport-keycloak-oauth2-oidc

// import * as superagent from 'superagent'
// "lib": ["es2015", "es2016", "dom", "es2017", "es6", "es5"],

# Mutation: {
  #     createProject: (parent, { title }) => {
#     return {
#       id: 1
#     }
#     // const projects = await client.mutate({
#     //   mutation: gql`
#     //     mutation InsertProject ($title: String!) {
#     //       insert_projects(objects: {title: $title})
#     //     }
#     //   `,
#     //   variables: { title: args.title }
#     // })
#     // return true
#   }

export const ProjectModule = new GraphQLModule({
  typeDefs: gql`
    type Post {
      id: ID!
      title: String
    }
    type Query {
      post(id: ID!): Post
    }
    type Mutation {
      createPost(title: String): String!
    }`,
  resolvers: {
    Query: {
      post: (parent, { id }, { db }, info) => { return { id: 1, title: 'hi' }}
    },
    Mutation: {
      createPost: (parent, { title }, { db }, info) =>
        'hi'
    }
  }
})
*/


https://moleculer.services/docs/0.13/index.html