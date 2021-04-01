import { make } from 'vuex-pathify'
import { typesense } from '../services/typesenseClient'
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
  async getUsersByQuery (_, { query }) {
    const { hits } = await typesense
      .collections(['databrary-users'])
      .documents()
      .search({
        q: query,
        query_by: 'familyName,givenName,additionalName,displayFullName,bio'
      })

    return hits.map((hit) => hit.document)
  },

  async getUserById (_, { id }) {
    const userDoc = await typesense
      .collections(['databrary-users'])
      .documents(id)
      .retrieve()
    return userDoc
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
