import gql from 'graphql-tag'

export default function createProject (name) {
  return {
    mutation: gql`
      mutation ($name: String!) {
        insert_assets(
          objects: { 
            name: $name,
            asset_type: project,
            privacy_type: private
          }
        ) {
          returning {
            id
          }
        }
      }
    `,
    variables: {
      name
    }
  }
}
