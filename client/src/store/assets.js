import { make } from 'vuex-pathify'
import { gql } from '@apollo/client'
import { apolloClient } from '../services/apolloClient'
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
  async fetchProjectAssets ({ commit }, projectId) {
    const result = await apolloClient.query({
      query: gql`
        query getProjectFiles($projectId: Int!) {
          assets(id: {_eq: $projectId}) {
            files {
              name
              fileFormatId
              uploadedDatetime
              fileobject {
                size
              }
            }
          }
        }
      `,
      variables: {
        projectId: projectId
      }
    })

    // commit('setData', result.data.assets[0].files)
    return _.get(result, 'data.assets[0].files', [])
  },
  // the createdById field is set from the session variable X-Hasura-User-Id
  // That is required in the client side
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
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
