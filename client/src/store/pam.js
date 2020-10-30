import { make } from 'vuex-pathify'

const state = {
  pams: [],
  views: [],
  bookmarks: [],
  selectedPam: null,
  selectedProjectView: null,
  refreshViews: false,
  refreshPams: false,
  refreshBookmarks: false
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
