import { make } from 'vuex-pathify'
import { gql } from '@apollo/client'
import { apolloClient } from '../services/apolloClient'
import axios from 'axios'
import _ from 'lodash'

const state = {
  // data: [],
  // nodes: [],
  // contents: []
}

const getters = {
  ...make.getters(state)
}

const mutations = {
  ...make.mutations(state),
  setData (state, data) {
    state.data = data
  }
}

const actions = {
  ...make.actions(state),
  // the createdById field is set from the session variable X-Hasura-User-Id
  // That is not required in the client side
  async insertAsset (_, { name, assetType, privacyType, parentId }) {
    const result = await apolloClient.mutate({
      mutation: gql`
        mutation (
          $name: String!
          $assetType: asset_types_enum!
          $privacyType: privacy_types_enum!
          $parentId: Int)
        {
          insert_assets(
            objects: {
              name: $name,
              assetType: $assetType,
              privacyType: $privacyType,
              parentId: $parentId
            }) 
          {
            returning {
              id
            }
          }
        }
      `,
      variables: {
        name,
        assetType,
        privacyType,
        parentId
      }
    })

    return result.data.insert_assets.returning[0].id
  },
  async updateAsset (_, { assetId, name }) {
    const result = await apolloClient.mutate({
      mutation: gql`
        mutation (
          $assetId: Int!
          $name: String!
        ) {
          update_assets(
            where: {id: {_eq: $assetId}}, 
            _set: {name: $name}
          ) {
            returning {
              id
              name
            }
          }
        }
      `,
      variables: {
        name,
        assetId
      }
    })

    return result.data.update_assets.returning[0].name
  },
  async deleteAssets (_, { assets }) {
    const result = await apolloClient.mutate({
      mutation: gql`
        mutation ($assets: [Int!]!) {
          delete_assets(where: {id: {_in: $assets}}) {
            returning {
              id
            }
          }
        }      
      `,
      variables: {
        assets
      }
    })
  },
  async getAssetUrl (_, assetId) {
    const { data } = await axios({ url: `/asset/${assetId}`, method: 'GET' })
    return data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
