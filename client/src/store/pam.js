import { make } from 'vuex-pathify'

const state = {
  pams: [],
  pamId: null,
  selectedProjectView: null,
  createView: false,
  viewCreated: null,
  views: []
}

const getters = {
  ...make.getters(state)
}

const mutations = {
  ...make.mutations(state)
}

const actions = {
  ...make.actions(state)
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
