import { gql } from '@apollo/client'

export default function createProject (name) {
  return {
    mutation: gql`
      mutation ($name: String!) {
        insert_assets(
          objects: {
            name: $name,
            assetType: project,
            privacyType: private
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
