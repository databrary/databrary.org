import { make } from 'vuex-pathify'

const state = {
  isLoggedIn: null,
  dbId: null,
  authServerId: null,
  emailPrimary: null,
  displayFullName: null,
  sessionId: null,
  version: 1
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
