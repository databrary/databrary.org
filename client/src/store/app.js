import { make } from 'vuex-pathify'
import axios from 'axios'
import _ from 'lodash'

const state = {
  isLoggedIn: false,
  dbId: null,
  authServerId: null,
  emailPrimary: null,
  thumbnail: null,
  gravatar: null,
  displayFullName: null,
  sessionId: null,
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
    try {
      // TODO(Reda): put this function in the store and call it as an action
      const response = await axios({ url: '/session', method: 'GET' })
      console.log(`Session response`, JSON.stringify(response.data))
      // The backend will always return a session id
      commit('sessionId', response.data.sessionID)
      if (_.get(response.data, 'dbId') !== undefined) {
        commit('isLoggedIn', true)
        commit('dbId', response.data.dbId)
        commit('thumbnail', response.data.gravatarURL.thumbnail)
        commit('gravatar', response.data.gravatarURL.large)
      } else {
        commit('isLoggedIn', false)
        commit('dbId', null)
        commit('thumbnail', null)
        commit('gravatar', null)
      }
    } catch (error) {
      commit('app/isBackendDisconnected', true)
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
