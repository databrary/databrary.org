import { gql } from '@apollo/client'

export default function createPam (name) {
  return {
    mutation: gql`
      mutation ($name: String!) {
        insert_assets(
          objects: {
            name: $name,
            assetType: pam,
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
