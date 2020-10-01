import { gql } from '@apollo/client'

export default function createProject (name, parentId) {
  return {
    mutation: gql`
      mutation ($name: String!) {
        insert_assets(
          objects: {
            parentId: $parentId,
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
      parentId,
      name
    }
  }
}
