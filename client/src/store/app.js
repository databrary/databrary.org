import { make } from 'vuex-pathify'
import axios from 'axios'
import _ from 'lodash'

const state = {
  isLoggedIn: false,
  dbId: null,
  authServerId: null,
  emailPrimary: null,
  thumbnail: null,
  avatar: null,
  displayFullName: null,
  isBackendDisconnected: false,
  version: 1
}

const getters = {
  ...make.getters(state)
}

const mutations = {
  ...make.mutations(state)
}

const actions = {
  ...make.actions(state),

  async syncSessionAsync ({ commit }) {
    const response = await axios({ url: '/session', method: 'GET' })
    console.log(`Session response`, JSON.stringify(response.data))
    if (_.get(response.data, 'dbId') !== undefined) {
      commit('isLoggedIn', true)
      commit('dbId', response.data.dbId)
      commit('thumbnail', response.data.avatarURL.thumbnail)
      commit('avatar', response.data.avatarURL.large)
    } else {
      commit('isLoggedIn', false)
      commit('dbId', null)
      commit('thumbnail', null)
      commit('avatar', null)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
