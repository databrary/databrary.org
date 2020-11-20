import { make } from 'vuex-pathify'

const state = {
  uploads: []
}

const getters = {
  ...make.getters(state)
}

const mutations = {
  ...make.mutations(state),
  add (state, payload) {
    state.uploads.push(payload)
  },
  update (state, { id, body }) {
    if (!id) return
    Object.assign(state.uploads.find((upload) => upload.id === id), body)
  }

}

const actions = {
  ...make.actions(state),
  addUpload ({ commit }, payload) {
    commit('add', payload)
  },
  updateUpload ({ commit }, payload) {
    if (!payload.id) return
    commit('update', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
