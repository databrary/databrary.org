import { make } from 'vuex-pathify'
import { gql } from '@apollo/client'
import { databrary } from '../services/apolloClient'
import axios from 'axios'
import _ from 'lodash'
import getAssetsByType from '@/gql/getAssetsByType.gql'
import getAssetProject from '@/gql/getAssetProject.gql'
import updateAssetName from '@/gql/updateAssetName.gql'
import insertAsset from '@/gql/insertAsset.gql'

const state = {
}

const getters = {
  ...make.getters(state)
}

const mutations = {
  ...make.mutations(state)
}

const actions = {
  ...make.actions(state),
  // the createdById field is set from the session variable X-Hasura-User-Id
  // That is not required in the client side

  async updateAssetName (_, { assetId, assetType, name }) {
    const { data } = await databrary.mutate({
      mutation: updateAssetName,
      variables: {
        assetId,
        assetType,
        name
      }
    })

    return data.update_assets.returning[0]
  },

  async getAssetProject (_, { assetId }) {
    const { data } = await databrary.query({
      query: getAssetProject,
      variables: {
        assetId
      }
    })

    return data
  },

  async getAssetsByType (_, { assetId, parentId, assetType }) {
    const { data } = await databrary.query({
      query: getAssetsByType,
      variables: {
        assetId,
        parentId,
        assetType
      }
    })

    return data
  },
  async insertAsset (_, { name, assetType, privacyType, parentId }) {
    const { data } = await databrary.mutate({
      mutation: insertAsset,
      variables: {
        name,
        assetType,
        privacyType,
        parentId
      }
    })

    return data.insert_assets.returning[0]
  },

  async updateAsset (_, { assetId, name }) {
    const result = await databrary.mutate({
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
    const result = await databrary.mutate({
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
