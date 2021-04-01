import { make } from 'vuex-pathify'
import updateProjectDescription from '@/gql/updateProjectDescription.gql'
import updateProjectImageId from '@/gql/updateProjectImageId.gql'
import updateProjectUseImage from '@/gql/updateProjectUseImage.gql'
import updateProjectColor from '@/gql/updateProjectColor.gql'
import updateProjectUrls from '@/gql/updateProjectUrls.gql'
import updateProjectCollaborators from '@/gql/updateProjectCollaborators.gql'
import insertProjectFunding from '@/gql/insertProjectFunding.gql'
import deleteProjectFunding from '@/gql/deleteProjectFunding.gql'
import updateProjectFunding from '@/gql/updateProjectFunding.gql'
import { databrary } from '../services/apolloClient'

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

  async updateProjectDescription (_, { assetId, description }) {
    const { data } = await databrary.mutate({
      mutation: updateProjectDescription,
      variables: {
        assetId,
        description
      }
    })

    return data.update_projects.returning[0]
  },

  async updateProjectImageId (_, { id, imageId }) {
    const { data } = await databrary.mutate({
      mutation: updateProjectImageId,
      variables: {
        id,
        imageId
      }
    })

    return data.update_projects.returning[0]
  },

  async updateProjectUseImage (_, { id, useImage }) {
    const { data } = await databrary.mutate({
      mutation: updateProjectUseImage,
      variables: {
        id,
        useImage
      }
    })

    return data.update_projects.returning[0]
  },

  async updateProjectColor (_, { id, color }) {
    const { data } = await databrary.mutate({
      mutation: updateProjectColor,
      variables: {
        id,
        color
      }
    })

    return data.update_projects.returning[0]
  },

  async updateProjectUrls (_, { id, urls }) {
    const { data } = await databrary.mutate({
      mutation: updateProjectUrls,
      variables: {
        id,
        urls
      }
    })

    return data.update_projects.returning[0]
  },

  async updateProjectCollaborators (_, { id, collaborators }) {
    const { data } = await databrary.mutate({
      mutation: updateProjectCollaborators,
      variables: {
        id,
        collaborators
      }
    })
    return data.update_projects.returning[0]
  },

  async insertProjectFunding (_, { object }) {
    const { data } = await databrary.mutate({
      mutation: insertProjectFunding,
      variables: {
        object
      }
    })

    return data.insert_projects_funding.returning[0]
  },

  async deleteProjectFunding (_, { id }) {
    const { data } = await databrary.mutate({
      mutation: deleteProjectFunding,
      variables: {
        id
      }
    })

    return data.delete_projects_funding_by_pk.id
  },

  async updateProjectFunding (_, { id, awards }) {
    const { data } = await databrary.mutate({
      mutation: updateProjectFunding,
      variables: {
        id: id,
        awards: awards
      }
    })

    return data.update_projects_funding_by_pk
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
